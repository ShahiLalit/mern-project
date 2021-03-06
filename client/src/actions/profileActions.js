import axios from 'axios';

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  CATCH_ERROR
} from './types/actionTypes';

export const getCurrentProfile = () => dispatch => {
  dispatch(getProfileLoader());
  axios
    .get('api/profile')
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    );
};

// Create a Profile

export const createProfile = (profileData, history) => dispatch => {
  axios
    .post('/api/profile', profileData)
    .then(res => history.push('/dashboard'))
    .catch(err =>
      dispatch({
        type: CATCH_ERROR,
        payload: err.response.data
      })
    );
};

// Profile Loading
export const getProfileLoader = () => dispatch => {
  return dispatch({
    type: PROFILE_LOADING
  });
};

// Clear Profile after logout
export const clearCurrentProfile = () => dispatch => {
  return dispatch({
    type: CLEAR_CURRENT_PROFILE
  });
};
