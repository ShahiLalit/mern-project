const express = require('express');
const router = new express.Router();
const passport = require('passport');

// Load Profile Field validation
const validateProfileInput = require('./../../validation/profile');

// Load Experience Field validation
const validateExperienceInput = require('./../../validation/experience');

// Load Education Field validation
const validateEducationInput = require('./../../validation/education');

// Load Profile Model
const Profile = require('./../../models/Profile');

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

// @route   GET /api/profile/all
// @desc    Get all Profile
// @access  Public
router.get('/all', (req, res) => {
  const errors = {};

  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then(profiles => {
      if (!profiles) {
        errors.profile = 'There are no Profiles.';
        res.status(404).json(errors);
      }
      res.json(profiles);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET /api/profile/handle/:handle
// @desc    Get Profile by Handle
// @access  Public
router.get('/handle/:handle', (req, res) => {
  const errors = {};

  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'There is no Profile with this handle.';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET /api/profile/user/:user_id
// @desc    Get Profile by user_id
// @access  Public
router.get('/user/:user_id', (req, res) => {
  const errors = {};

  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then(profile => {
      if (!profile) {
        errors.profile = 'There is no Profile with this user_id.';
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch(() => {
      errors.profile = 'There is no Profile with this user_id.';
      res.status(404).json(errors);
    });
});

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
      profileFields.skills = req.body.skills
        .split(',')
        .map(skill => skill.trim());
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

// @route   POST /api/profile/experience
// @desc    Add User Experience
// @access  Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to Profile Collection but at the  beginning of the array.
      profile.experience.unshift(newExp);

      profile.save().then(profile => res.status(200).json(profile));
    });
  }
);

// @route   POST /api/profile/education
// @desc    Add User Education
// @access  Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    // Check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then(profile => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      };

      // Add to Profile Collection but at the beginning of the array.
      profile.education.unshift(newEdu);

      profile.save().then(profile => res.status(200).json(profile));
    });
  }
);

// @route   DELETE /api/profile/experience/:exp_id
// @desc    Delete User Experience
// @access  Private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // First find the Index of the Experience we want to delete from Experience Array.
      const removeIndex = profile.experience.findIndex(
        item => item.id === req.params.exp_id
      );

      // Remove the experience from the array using splice.
      profile.experience.splice(removeIndex, 1);

      // Save the profile
      profile
        .save()
        .then(profile => res.status(200).json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);

// @route   DELETE /api/profile/education/:edu_id
// @desc    Delete User Education
// @access  Private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      // First find the Index of the Education we want to delete from Education Array.

      const removeIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      /** OR **/
      /** ******* 

      const removeIndex = profile.education.findIndex(
        item => item.id === req.params.exp_id
      );

      * ******* **/

      // Remove the Education from the array using splice.
      profile.education.splice(removeIndex, 1);

      // Save the profile
      profile
        .save()
        .then(profile => res.status(200).json(profile))
        .catch(err => res.status(404).json(err));
    });
  }
);
module.exports = router;
