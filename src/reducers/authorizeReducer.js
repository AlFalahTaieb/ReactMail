import {AUTHORIZED, UNAUTHORIZED} from '../constants'

const initialState = {
  isAuthenticated: false
};

export default function authorizeReducer(state = initialState, action) {
  switch (action.type) {
    case AUTHORIZED:
      return {
        isAuthenticated: true
      };
    case UNAUTHORIZED:
      return {
        isAuthenticated: false
      };
    default:
      return state;
  }
}