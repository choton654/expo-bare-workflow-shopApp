import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { CustomHeaderButton } from "../../components/HeaderButton";
import ProductItems from "../../components/ProductItems";
import colors from "../../constants/colors";
import { addToCart } from "../../store/action/cart";
import { getProducts } from "../../store/action/product";
const ProductOverviewScreen = ({ navigation }) => {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState(null);

  const { allProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);

  const loadProducts = useCallback(async () => {
    setRefreshing(true);
    try {
      await dispatch(getProducts());
    } catch (error) {
      seterror(error.message);
    }
    setRefreshing(false);
  }, [dispatch, setloading, seterror]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadProducts();
    });

    return unsubscribe;
  }, [loadProducts]);

  useEffect(() => {
    setloading(true);
    loadProducts().then(() => setloading(false));
  }, [loadProducts]);

  const productHandler = (item) => {
    navigation.navigate("ProductDetails", {
      productId: item.id,
      productTitle: item.title,
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!loading && allProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No Product Found</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An Error Occurred</Text>
        <Button
          title="Try Again"
          onPress={loadProducts}
          color={colors.primary}
        />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={allProducts}
        onRefresh={loadProducts}
        refreshing={loading}
        renderItem={(itemData) => (
          <ProductItems
            {...itemData.item}
            onSelect={() => {
              productHandler(itemData.item);
            }}
          >
            <Button
              color={colors.primary}
              title="View Details"
              onPress={() => {
                productHandler(itemData.item);
              }}
            />
            <Button
              color={colors.primary}
              title="To Cart"
              onPress={() => {
                dispatch(addToCart(itemData.item));
              }}
            />
          </ProductItems>
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
};

export default ProductOverviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export const productsOverviewScreenOptions = (navData) => {
  return {
    headerTitle: "All Products",
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
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};
