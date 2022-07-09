const express = require('express');
const {sendMessage , allMessages} = require('../controllers/messageController');
const { protectauth } = require('../middlewares/authMiddleware');
const router = express.Router();
router.route('/').post(protectauth, sendMessage);
router.route('/:chatId').get(protectauth, allMessages);

module.exports = router;