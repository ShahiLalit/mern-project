import axios from 'axios';
import { CATCH_ERROR } from './actionTypes/auth';

export const registerUser = userData => dispatch => {
  axios
    .post('/api/users/register', userData)
    .then(res => console.log(res.data))
    .catch(err =>
      dispatch({
        type: CATCH_ERROR,
        payload: err.response.data
      })
    );
};
