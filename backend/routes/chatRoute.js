const express = require('express');
const { chat, fetchChats, createGroupChat, renameGroup, addUser, removeGroup } = require('../controllers/chatController');
const { protectauth } = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/')
    .get(protectauth, fetchChats)
    .post(protectauth, chat)
    
router.route('/group').post(protectauth, createGroupChat)
router.route('/renamegroup').put(protectauth, renameGroup)
router.route('/add').put(protectauth, addUser)
router.route('/remove').put(protectauth, removeGroup)

module.exports = router;