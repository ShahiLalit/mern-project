const express = require('express');
const router = express.Router();

// @route   GET /api/profile/test
// @desc    Testing Profile Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Route Works!' }));

module.exports = router;
