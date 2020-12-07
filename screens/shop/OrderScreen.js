import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { CustomHeaderButton } from "../../components/HeaderButton";
import OrderItem from "../../components/OrderItem";
import colors from "../../constants/colors";
import { getOrders } from "../../store/action/order";

const OrderScreen = () => {
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);

  const getOrdersLoading = useCallback(async () => {
    await dispatch(getOrders());
  }, []);

  useEffect(() => {
    setloading(true);
    getOrdersLoading().then(() => setloading(false));
  }, [getOrdersLoading]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>You have no orders, maybe order some products</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={(itemData) => (
          <OrderItem {...itemData.item} date={itemData.item.readableDate} />
        )}
      />
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const ordersScreenOptions = (navData) => {
  return {
    headerTitle: "Your Orders",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};
