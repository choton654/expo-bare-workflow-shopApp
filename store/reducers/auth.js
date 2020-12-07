import { AUTHENTICATE, LOGOUT, SET_DID_TRY_AL, SIGNUP } from "../action/auth";

const initState = {
  token: null,
  userId: null,
  didTryAutoLogin: false,
};

export default (state = initState, action) => {
  switch (action.type) {
    case AUTHENTICATE:
      return {
        token: action.payload.token,
        userId: action.payload.userId,
        didTryAutoLogin: true,
      };

    case SET_DID_TRY_AL:
      return {
        ...state,
        didTryAutoLogin: true,
      };

    case LOGOUT:
      return {
        ...initState,
        didTryAutoLogin: true,
      };

    default:
      return state;
  }
};
