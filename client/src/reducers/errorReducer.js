import { CATCH_ERROR } from './../actions/types/actionTypes';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case CATCH_ERROR:
      return action.payload;
    default:
      return state;
  }
}
