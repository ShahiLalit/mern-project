import { TEST_DISPATCH_ACTION } from './actionTypes/auth';

export const registerUser = userData => dispatch => {
  return dispatch({
    type: TEST_DISPATCH_ACTION,
    payload: userData
  });
};
