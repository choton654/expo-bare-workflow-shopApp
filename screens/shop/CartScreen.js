import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import CartItem from "../../components/CartItem";
import { addToOrder } from "../../store/action/order";
import { useDispatch, useSelector } from "react-redux";
import colors from "../../constants/colors";
import Card from "../../components/Card";

const CartScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { items, totalAmount } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const cartItems = () => {
    const transformedCartItems = [];
    for (const key in items) {
      transformedCartItems.push({
        productId: key,
        productTitle: items[key].productTitle,
        productPrice: items[key].productPrice,
        quantity: items[key].quantity,
        sum: items[key].sum,
      });
    }
    return transformedCartItems.sort((a, b) =>
      a.productId > b.productId ? 1 : -1
    );
  };

  const sendOrderHandler = async () => {
    setIsLoading(true);
    await dispatch(addToOrder(cartItems(), totalAmount));
    setIsLoading(false);
  };

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>
            ${Math.round(totalAmount.toFixed(2) * 100) / 100}
          </Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Button
            color={colors.accent}
            title="Order Now"
            disabled={cartItems().length === 0}
            onPress={sendOrderHandler}
          />
        )}
      </Card>
      <FlatList
        data={cartItems()}
        keyExtractor={(item) => item.productId}
        renderItem={(itemData) => <CartItem {...itemData.item} deletable />}
      />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontSize: 18,
  },
  amount: {
    color: colors.primary,
  },
});

export const cartScreenOptions = {
  headerTitle: "Your Cart",
};
