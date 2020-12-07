import React from 'react';
import {Button, StyleSheet, Text, View, FlatList} from 'react-native';
import CartItem from '../../components/CartItem';
import {addToOrder} from '../../store/action/order';
import {useDispatch, useSelector} from 'react-redux';

const CartScreen = () => {
  const {items, totalAmount} = useSelector((state) => state.cart);
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
      a.productId > b.productId ? 1 : -1,
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.cartOrder}>
        <Text style={{fontSize: 18}}>Total: $ {totalAmount.toFixed(2)}</Text>
        <Button
          title="Order Now"
          onPress={() => {
            dispatch(addToOrder(cartItems(), totalAmount));
          }}
        />
      </View>
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
    display: 'flex',
    flexDirection: 'column',
  },
  cartOrder: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    padding: 20,
  },
});

export const cartScreenOptions = {
  headerTitle: 'Your Cart',
};
