import { REGISTER_NEW_USER } from './../actions/actionTypes/auth';

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case REGISTER_NEW_USER:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload
      };
    default:
      return state;
  }
}
