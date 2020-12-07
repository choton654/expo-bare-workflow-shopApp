import React from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {removeFromCart} from '../store/action/cart';

const CartItem = (props) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.cartitems}>
      <View
        style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
        <Text>{props.quantity}</Text>
        <Text style={{paddingLeft: 10}}>{props.productTitle}</Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{paddingRight: 20}}>${props.productPrice}</Text>

        {/* <TouchableOpacity onPress={props.onRemove}>
          <MaterialCommunityIcons name="home" color="red" size={26} />
        </TouchableOpacity> */}
        {props.deletable && (
          <Button
            title="remove"
            onPress={() => dispatch(removeFromCart(props.productId))}
          />
        )}
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  cartitems: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
  },
});
