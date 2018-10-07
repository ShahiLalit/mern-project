const express = require('express');
const router = new express.Router();
const passport = require('passport');

// Load Posts Model
const Post = require('./../../models/Post');

// Load User Model
const User = require('./../../models/User');

// Load Profile Model
// const Profile = require('./../../models/Profile');

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

// @route   GET /api/posts
// @desc    Get all Posts
// @access  Public

router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(404).json(err));
});

// @route   GET /api/posts/:id
// @desc    Get a single Post
// @access  Public

router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.status(200).json(post))
    .catch(() => res.status(404).json({ error: 'No Post Found' }));
});

// @route   DELETE /api/posts/:id
// @desc    Delete a single Post
// @access  Private

router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(() => {
      Post.findById(req.params.id)
        .then(post => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ notauthorized: 'User not authorized' });
          }

          // Delete
          post.remove().then(() => res.json({ success: true }));
        })
        .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// Export the Routes
module.exports = router;
