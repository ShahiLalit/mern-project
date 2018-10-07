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

// @route   POST /api/posts/like/:id
// @desc    Like a single Post
// @access  Private

router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(() => {
      Post.findById(req.params.id)
        .then(post => {
          // Find if the user logged in, has liked the post already.
          const userLiked = post.likes.filter(
            like => like.user.toString() === req.user.id
          );

          if (userLiked.length > 0) {
            // If Yes, the user has already liked the post, send 400 status
            return res.status(400).json({ error: 'Already Liked!' });
          }

          // If not, add the user liked the post to the array.
          post.likes.unshift({ user: req.user.id });

          // Save the post after being liked by the user
          post.save().then(post => res.status(200).json(post));
        })
        .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST /api/posts/unlike/:id
// @desc    Unlike a single Post
// @access  Private

router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOne({ _id: req.user.id }).then(() => {
      Post.findById(req.params.id)
        .then(post => {
          // Find if the user logged in, has liked the post already.
          const userLiked = post.likes.filter(
            like => like.user.toString() === req.user.id
          );

          if (userLiked.length === 0) {
            // If Yes, the user has already liked the post, send 400 status
            return res
              .status(400)
              .json({ error: 'You have not liked the post yet' });
          }

          // Get Index of the user id
          const removeIndex = post.likes
            .map(like => like.user.toString())
            .indexOf(req.user.id);

          // remove the user id from the likes array using splice
          post.likes.splice(removeIndex, 1);

          // Save the post after being unliked by the user
          post.save().then(post => res.status(200).json(post));
        })
        .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
    });
  }
);

// @route   POST /api/posts/comment/:id
// @desc    Entering a comment on the Posts
// @access  Private

router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
      .then(post => {
        const newComment = new Post({
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        });

        // Add to comments array
        post.comments.unshift(newComment);

        // Save the post
        post.save().then(post => res.status(200).json(post));
      })
      .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// @route   DELETE /api/posts/comment/:id/:comment_id
// @desc    Deleting a comment on the Posts
// @access  Private

router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Get Index of the comment id
        const commentToDelete = post.comments.filter(
          comment => comment._id.toString() === req.params.comment_id
        );

        if (commentToDelete.length === 0) {
          // If this is true, comment does not exist. Send 404 status.
          return res
            .status(404)
            .json({ error: 'You have not commentd the post yet' });
        }

        // Get Index of the comment id to remove
        const removeIndex = post.comments
          .map(comment => comment._id.toString())
          .indexOf(req.params.comment_id);

        // remove the user id from the comments array using splice
        post.comments.splice(removeIndex, 1);

        // Save the post after being uncommentd by the user
        post.save().then(post => res.status(200).json(post));
      })
      .catch(() => res.status(404).json({ postnotfound: 'No post found' }));
  }
);

// Export the Routes
module.exports = router;
