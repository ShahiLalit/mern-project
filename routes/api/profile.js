const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Model
const Profile = require('./../../models/Profile');

// Load User Model
const User = require('./../../models/User');

// @route   GET /api/profile/test
// @desc    Testing Profile Route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Route Works!' }));

// @route   GET /api/profile
// @desc    Get current User's Profile
// @access  Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    let errors = {};

    Profile.findOne({ user: req.user.id })
      .then(profile => {
        if (!profile) {
          errors.noProfile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.status(200).json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
