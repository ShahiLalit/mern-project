import axios from 'axios';

import { GET_PROFILE, PROFILE_LOADING } from './types/actionTypes';

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

export const getProfileLoader = () => dispatch => {
  return {
    type: PROFILE_LOADING
  };
};
