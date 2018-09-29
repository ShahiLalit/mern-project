const express = require('express');
const router = express.Router();

// @route   GET /api/posts/test
// @desc    Testing Posts Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Route Works!' }));

module.exports = router;
