import Asyncstorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
import { authenticate } from "../store/action/auth";

const StartUpScreen = (props) => {
  const dispatch = useDispatch();
  console.log("props", props);
  useEffect(() => {
    const startAuth = async () => {
      const storageData = await Asyncstorage.getItem("userData");
      if (storageData === null) {
        // props.navigation.navigate("Auth");
        return;
      }
      const { token, userId, expeiryDate } = JSON.parse(storageData);
      if (new Date(expeiryDate) <= new Date() || !token || !userId) {
        // props.navigation.navigate("Auth");
        return;
      }
      dispatch(authenticate(token, userId));
      // props.navigation.navigate("Products");
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
