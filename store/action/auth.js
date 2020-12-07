export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SET_DID_TRY_AL = "SET_DID_TRY_AL";

import AsyncStorage from "@react-native-async-storage/async-storage";

let timer;

export const setDidTryAL = () => {
  return { type: SET_DID_TRY_AL };
};

export const authenticate = (token, userId, expiryTime) => (dispatch) => {
  dispatch(setLogoutTimer(expiryTime));
  dispatch({ type: AUTHENTICATE, payload: { token, userId } });
};

export const signUp = (email, password) => async (dispatch) => {
  try {
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBk5Vk7rlB-RUhTga3aD4Ow2bqo07cuCcY",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      const errorData = await res.json();
      let error = "Something went wrong";
      if (errorData.error.message === "EMAIL_EXISTS") {
        error = "email already exists";
      }
      throw new Error(error);
    }
    dispatch(
      authenticate(data.idToken, data.localId, parseInt(data.expiresIn) * 1000)
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(data.expiresIn) * 1000
    );
    saveDataToStorage(data.idToken, data.localId, expirationDate);
  } catch (error) {
    throw error;
  }
};

export const logIn = (email, password) => async (dispatch) => {
  try {
    const res = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBk5Vk7rlB-RUhTga3aD4Ow2bqo07cuCcY",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    );

    const data = await res.json();
    if (!res.ok) {
      const errorData = await res.json();
      let error = "Something went wrong";
      if (errorData.error.message === "EMAIL_NOT_FOUND") {
        error = "email does not match";
      } else if (errorData.error.message === "INVALID_PASSWORD") {
        error = "invalid password";
      }
      throw new Error(error);
    }
    dispatch(
      authenticate(data.idToken, data.localId, parseInt(data.expiresIn) * 1000)
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(data.expiresIn) * 1000
    );
    saveDataToStorage(data.idToken, data.localId, expirationDate);
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: "LOGOUT" };
};

const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = async (token, userId, expirationDate) => {
  await AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expeiryDate: expirationDate.toISOString(),
    })
  );
};
