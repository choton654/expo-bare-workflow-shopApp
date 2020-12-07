import React from "react";
import { Alert, Button, Platform, StyleSheet, Text, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch, useSelector } from "react-redux";
import { CustomHeaderButton } from "../../components/HeaderButton";
import ProductItems from "../../components/ProductItems";
import colors from "../../constants/colors";
import { deleteProduct } from "../../store/action/product";

const UserProductScreen = ({ navigation }) => {
  const { userProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const editHandler = (id) => {
    navigation.navigate("Edit", { productId: id });
  };

  const deletHandler = (id) => {
    Alert.alert("Are you sure?", "Do you want to delete this item", [
      {
        text: "No",
        style: "default",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: () => {
          dispatch(deleteProduct(id));
        },
      },
    ]);
  };

  if (userProducts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>You have no products, maybe create some</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={userProducts}
        renderItem={(itemData) => (
          <ProductItems
            {...itemData.item}
            onSelect={() => {
              editHandler(itemData.item.id);
            }}
          >
            <Button
              color={colors.primary}
              title="Edit"
              onPress={() => {
                editHandler(itemData.item.id);
              }}
            />
            <Button
              color={colors.primary}
              title="Delete"
              onPress={() => {
                deletHandler(itemData.item.id);
              }}
            />
          </ProductItems>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default UserProductScreen;

const styles = StyleSheet.create({});

export const userProductsScreenOptions = (navData) => {
  return {
    headerTitle: "Your Products",
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
          title="Add"
          iconName={Platform.OS === "android" ? "md-create" : "ios-create"}
          onPress={() => {
            navData.navigation.navigate("EditProduct");
          }}
        />
      </HeaderButtons>
    ),
  };
};
