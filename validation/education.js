const validator = require('validator');
const isEmpty = require('./is-empty');

const validateEducationInput = data => {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';
  data.to = !isEmpty(data.to) ? data.to : '';

  if (validator.isEmpty(data.school)) {
    errors.school = 'School field is required';
  }

  if (validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is required';
  }

  if (validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of Study is required';
  }

  if (validator.isEmpty(data.from)) {
    errors.from = 'From field is required';
  }

  if (!data.current && validator.isEmpty(data.to)) {
    errors.to = "If not Current, 'To' field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

module.exports = validateEducationInput;
