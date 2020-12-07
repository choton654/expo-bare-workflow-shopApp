import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import Colors from '../../constants/colors';
import {addToCart} from '../../store/action/cart';
import {useSelector, useDispatch} from 'react-redux';

const ProductDetailsScreen = ({navigation, route}) => {
  const {productId, productTitle} = route.params;

  const {allProducts} = useSelector((state) => state.products);
  const dispatch = useDispatch();

  const singleProduct = allProducts.find((p) => p.id === productId);
  return (
    <View>
      <Image style={styles.image} source={{uri: singleProduct.imageUrl}} />
      <View
        style={{
          height: 200,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          padding: 20,
        }}>
        <Button
          color={Colors.primary}
          title="Add to Cart"
          onPress={() => {
            dispatch(addToCart(singleProduct));
          }}
        />
        <Text style={{fontSize: 20}}>${singleProduct.price}</Text>
        <Text style={{textAlign: 'center'}}>{singleProduct.description}</Text>
      </View>
    </View>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 300,
  },
});

export const productDetailScreenOptions = (navData) => {
  return {
    headerTitle: navData.route.params.productTitle,
  };
};
