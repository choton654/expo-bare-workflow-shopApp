import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { useDispatch } from "react-redux";
import Card from "../../components/Card";
import Input from "../../components/Input";
import colors from "../../constants/colors";
import { logIn, signUp } from "../../store/action/auth";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateValidites = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsvalid = true;
    for (const key in updateValidites) {
      console.log(key, updatedFormIsvalid);
      updatedFormIsvalid = updatedFormIsvalid && updateValidites[key];
    }

    return {
      inputValues: updatedValues,
      inputValidities: updateValidites,
      formIsValid: updatedFormIsvalid,
    };
  }
  return state;
};

const AuthScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  const [isSignUp, setisSignUp] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [error, seterror] = useState(false);

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  const signUpHandler = async () => {
    seterror(null);
    setisLoading(true);
    try {
      if (isSignUp) {
        await dispatch(
          signUp(formState.inputValues.email, formState.inputValues.password)
        );
      } else {
        await dispatch(
          logIn(formState.inputValues.email, formState.inputValues.password)
        );
      }
      setisLoading(false);
    } catch (error) {
      setisLoading(false);
      seterror(error.message);
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert("something went erong", error, [{ text: "Okay" }]);
    }
  }, [error]);

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={50}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-Mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email address."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password."
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.buttonContainer}>
              {isLoading ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Button
                  title={isSignUp ? "Sign Up" : "Login"}
                  color={colors.primary}
                  onPress={signUpHandler}
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button
                title={`Switch to ${isSignUp ? "Login" : "Sign Up"}`}
                color={colors.accent}
                onPress={() => {
                  setisSignUp((prevState) => !prevState);
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "100%",
    maxWidth: 400,
    maxHeight: 400,
    justifyContent: "center",
    padding: 20,
  },
  buttonContainer: {
    marginTop: 10,
  },
});

export const authScreenOptions = {
  headerTitle: "Authenticate",
};
