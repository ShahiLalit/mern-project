import axios from 'axios';
import { CATCH_ERROR } from './actionTypes/auth';

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
