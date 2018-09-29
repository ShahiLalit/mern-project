const express = require('express');
const router = express.Router();

// @route   GET /api/users/test
// @desc    Testing Users Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Route Works!' }));

module.exports = router;