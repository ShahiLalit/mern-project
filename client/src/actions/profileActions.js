import axios from 'axios';

import {
  GET_PROFILE,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE
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
