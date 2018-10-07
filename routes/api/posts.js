const express = require('express');
const router = new express.Router();
const passport = require('passport');

// Load Posts Model
const Post = require('./../../models/Post');

// Load Profile Field validation
const validatePostInput = require('./../../validation/post');

// @route   GET /api/posts/test
// @desc    Testing Posts Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Route Works!' }));

// @route   POST /api/posts
// @desc    Creating Posts Route
// @access  Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.status(200).json(post));
  }
);

// Export the Routes
module.exports = router;
