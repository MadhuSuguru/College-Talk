const express = require('express');
const collegesData = require('../config/collegesData');
const router = express.Router();

router.route('/').get(collegesData);

module.exports = router;