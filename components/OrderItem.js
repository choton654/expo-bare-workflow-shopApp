import React, {useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import CartItem from './CartItem';
const OrderItem = (props) => {
  const [showdetails, setshowdetails] = useState(false);

  return (
    <View style={styles.orderitems}>
      <View style={styles.summary}>
        <Text>Total ${props.totalAmount}</Text>
        <Text>{props.date}</Text>
      </View>
      <Button
        title={showdetails ? 'Hide Details' : 'Show Details'}
        onPress={() => setshowdetails((prevState) => !prevState)}
      />
      {showdetails && (
        <View style={{width: '100%'}}>
          {props.items.map((cartitem, idx) => (
            <CartItem key={idx} {...cartitem} deletable={false} />
          ))}
        </View>
      )}
    </View>
  );
};

export default OrderItem;

const styles = StyleSheet.create({
  orderitems: {
    margin: 10,
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 5,
    borderRadius: 10,
    padding: 20,
  },
  summary: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});
