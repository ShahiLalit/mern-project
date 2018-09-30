const express = require('express');
const router = new express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load User Model
const User = require('./../../models/User');

// @route   GET /api/users/test
// @desc    Testing Users Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Route Works!' }));

// @route   POST /api/users/register
// @desc    Registering Users Route
// @access  Public
router.post('/register', (req, res) =>
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        // Check for user
        return res.status(400).json({ email: 'Email Already Exists' });
      }
      // Load user avatar using gravatar
      const avatar = gravatar.url(req.body.email, {
        s: '200', // Size
        r: 'pg', // Rating
        d: 'mm' // Default
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    })
    .catch(err => console.log(err))
);

// @route   POST /api/users/login
// @desc    Users Login Route == Returning JWT Token
// @access  Public

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email })
    .then(user => {
      // Check for user
      if (!user) {
        return res.status(404).json({ email: 'User Email Not Found' });
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
          // User Found
          // Create JWT payload
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };

          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 60 * 60 },
            (err, token) =>
              res.json({ success: true, token: `Bearer ${token}` })
          );
        } else {
          return res.status(400).json({ password: 'Password Incorrect!' });
        }
      });
    })
    .catch(err => console.log(err));
});

// Exporting the user router module
module.exports = router;
