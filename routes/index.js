const express = require('express');
const router = express.Router();

// Define your main routes here
router.use('/videos', require('./videos'));

module.exports = router;
