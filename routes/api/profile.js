const express = require('express');
const router = new express.Router();
// const mongoose = require('mongoose');
const passport = require('passport');

// Load Profile Field validation
const validateProfileInput = require('./../../validation/profile');

// Load Profile Model
const Profile = require('./../../models/Profile');

// Load User Model
// const User = require('./../../models/User');

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
      .populate('user', ['name', 'avatar'])
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

// @route   POST /api/profile
// @desc    Create OR Edit User Profile
// @access  Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    // Get Fields for User Profile
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) {
      profileFields.handle = req.body.handle;
    }
    if (req.body.company) {
      profileFields.company = req.body.company;
    }
    if (req.body.website) {
      profileFields.website = req.body.website;
    }
    if (req.body.location) {
      profileFields.location = req.body.location;
    }
    if (req.body.bio) {
      profileFields.bio = req.body.bio;
    }
    if (req.body.status) {
      profileFields.status = req.body.status;
    }
    if (req.body.githubusername) {
      profileFields.githubusername = req.body.githubusername;
    }
    // Split Skills into an Array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};

    if (req.body.youtube) {
      profileFields.social.youtube = req.body.youtube;
    }
    if (req.body.facebook) {
      profileFields.social.facebook = req.body.facebook;
    }
    if (req.body.twitter) {
      profileFields.social.twitter = req.body.twitter;
    }
    if (req.body.linkedin) {
      profileFields.social.linkedin = req.body.linkedin;
    }
    if (req.body.instagram) {
      profileFields.social.instagram = req.body.instagram;
    }

    // Check if Profile Exist = Update OR Create Profile
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // Update the Profile
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // Create the Profile
        // But first check if handle exists
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = 'Handle already exists';
            res.status(400).json(errors);
          }

          // Save Profile
          new Profile(profileFields)
            .save()
            .then(profile => res.status(200).json(profile));
        });
      }
    });
  }
);

module.exports = router;
