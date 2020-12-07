import Asyncstorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import { authenticate, setDidTryAL } from "../store/action/auth";

const StartUpScreen = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const startAuth = async () => {
      const storageData = await Asyncstorage.getItem("userData");
      if (storageData === null) {
        dispatch(setDidTryAL());
        return;
      }
      const { token, userId, expiryDate } = JSON.parse(storageData);
      const expiretionDate = new Date(expiryDate);

      if (expiretionDate <= new Date() || !token || !userId) {
        dispatch(setDidTryAL());
        return;
      }

      const expirationTime = expiretionDate.getTime() - new Date().getTime();

      dispatch(authenticate(token, userId, expirationTime));
    };
    try {
      startAuth();
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
};

export default StartUpScreen;

const styles = StyleSheet.create({});
