const asyncHandler = require('express-async-handler');
const chatModel = require('../models/chatModel');
const User = require('../models/userModel');


const chat = asyncHandler(async (req, res) => {
    const { userId,name } = req.body;
    if (!userId) return res.status(400);
    var isChat = await chatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        
        ]
    }).populate("users", "-password").populate("latestMessage");
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'username dp'
    })
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        var chatData = {
            chatName: name,
            isGroupChat: 'false',
            users: [req.user._id, userId]
        }

        try {
            const createChat = await chatModel.create(chatData);
            const FullChat = await chatModel.findOne({ _id: createChat._id }).populate("users", "-password");
            res.status(200).send(FullChat);

        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }
    }
});

const fetchChats = asyncHandler(async (req, res) => {
    try {
        chatModel.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (result) => {
                result = await User.populate(result, {
                    path: "latestMessage.sender",
                    select: "username email dp",
                })
                res.status(200).send(result);
            });
        
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
});

const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        res.status(400).send("Please Fill all fields" );
    }
    var users = JSON.parse(req.body.users);
    if (users.length < 1) {
        return res.status(400).send("Add Atleast a User" );
    }
    users.push(req.user._id);
    try {
        const groupChat = await chatModel.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin:req.user,
        })

        const fullgroupchat = await chatModel.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")

        res.status(200).json(fullgroupchat);

    } catch (error) {
        res.status(400); throw new Error(error.message);
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await chatModel.findByIdAndUpdate(chatId, { chatName }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(400); throw new Error("Chat Not Found");
    }
    else res.json(updatedChat);
})

const addUser = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;
    const added = await chatModel.findByIdAndUpdate(chatId,
        { $push: { users: userId }, },
        { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!added) {
        res.status(400);
        throw new Error("Error Occured");
    }
    else {
        res.json(added);
    }
})

const removeGroup = asyncHandler(async (req, res) => {
    const { userId, chatId } = req.body;
    const removed = await chatModel.findByIdAndUpdate(chatId, { $pull: { users: userId }, }, { new: true, })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!removed) {
        res.status(400);
        throw new Error("Error Occured");
    }
    else {
        res.json(removed);
    }
})
module.exports = { chat, fetchChats ,createGroupChat ,renameGroup,addUser,removeGroup};