import axios from 'axios';
import { CATCH_ERROR, SET_CURRENT_USER } from './types/actionTypes';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';

// Register User Action Creator

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: CATCH_ERROR,
        payload: err.response.data
      })
    );
};

// Login User Action Creator

export const loginUser = userData => dispatch => {
  axios
    .post('/api/users/login', userData)
    .then(res => {
      // Retrieve the Auth Token
      const { token } = res.data;
      // Save Auth Token to localStorage
      localStorage.setItem('jwtToken', token); // always takes string -> if data not a string parse it & then save
      // Set Auth Token to header
      setAuthToken(token);
      // Decode the token to get User data
      const decoded = jwt_decode(token);
      // Set Current User
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: CATCH_ERROR,
        payload: err.response.data
      })
    );
};

export const setCurrentUser = decoded => dispatch => {
  return dispatch({
    type: SET_CURRENT_USER,
    payload: decoded
  });
};

export const logoutUser = () => dispatch => {
  // Remove the Token from the localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth Header for future Private Route requests
  setAuthToken(false);
  // Set current user to {} and isAuthenticated to false
  dispatch(setCurrentUser({}));
};
