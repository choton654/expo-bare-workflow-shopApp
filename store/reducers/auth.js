import {AUTHENTICATE, LOGOUT, SIGNUP} from '../action/auth';

const initState = {
  token: null,
  userId: null,
  isLoggedIn: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.payload.token,
        userId: action.payload.userId,
        isLoggedIn: true,
      };

    case LOGOUT:
      return initState;

    default:
      return state;
  }
};
