import { CATCH_ERROR } from './../actions/actionTypes/auth';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case CATCH_ERROR:
      return action.payload;
    default:
      return state;
  }
}
