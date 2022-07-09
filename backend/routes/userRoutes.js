const express = require('express');
const router = express.Router();
const { registerUser, authUser, allUsers } = require('../controllers/userController');
const { protectauth } = require('../middlewares/authMiddleware');

router.route("/")
    .get(protectauth,allUsers)
    .post(registerUser)
router.route("/login").post(authUser);
module.exports = router;