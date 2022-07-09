const asyncHandler = require("express-async-handler");
const chatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { message, chatId } = req.body;
    if (!message || !chatId) {
        return res.sendStatus(400);
    }
    const newMessage = {
        sender: req.user._id,
        message: message,
        chat: chatId,
    }
    try {
        var msg = await messageModel.create(newMessage);
        msg = await msg.populate("sender", "username dp")
        msg = await msg.populate("chat");
        msg = await User.populate(msg, {
            path: 'chat.users',
            select: 'username dp',
        })
        await chatModel.findByIdAndUpdate(chatId, { latestMessage: msg });
        res.json(msg);
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
});
const allMessages = asyncHandler(async(req,res) => {
    try {
        const message = await messageModel.find({ chat: req.params.chatId }).populate("sender", "username dp").populate('chat');
        res.json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error);
    }
})
module.exports = { sendMessage, allMessages };