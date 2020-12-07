import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import colors from "../constants/colors";
import Card from "./Card";
import CartItem from "./CartItem";
const OrderItem = (props) => {
  const [showdetails, setshowdetails] = useState(false);

  return (
    <Card style={styles.orderItem}>
      <View style={styles.summary}>
        <Text style={styles.totalAmount}>${props.totalAmount.toFixed(2)}</Text>
        <Text style={styles.date}>{props.date}</Text>
      </View>
      <Button
        color={colors.primary}
        title={showdetails ? "Hide Details" : "Show Details"}
        onPress={() => {
          setshowdetails((prevState) => !prevState);
        }}
      />
      {showdetails && (
        <View style={styles.detailItems}>
          {props.items.map((cartitem, idx) => (
            <CartItem key={idx} {...cartitem} deletable={false} />
          ))}
        </View>
      )}
    </Card>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  orderItem: {
    margin: 20,
    padding: 10,
    alignItems: "center",
  },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 15,
  },
  totalAmount: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    color: "#888",
  },
  detailItems: {
    width: "100%",
  },
});
