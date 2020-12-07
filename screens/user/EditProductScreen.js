import {CommonActions} from '@react-navigation/native';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../../components/Input';
import colors from '../../constants/colors';
import {addProduct, updateProduct} from '../../store/action/product';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateValidites = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsvalid = true;
    for (const key in updateValidites) {
      console.log(key, updatedFormIsvalid);
      updatedFormIsvalid = updatedFormIsvalid && updateValidites[key];
    }

    return {
      inputValues: updatedValues,
      inputValidities: updateValidites,
      formIsValid: updatedFormIsvalid,
    };
  }
  return state;
};

const EditProductScreen = ({route, navigation}) => {
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState();

  const {userProducts} = useSelector((state) => state.products);
  const prodId = route.params.productId ? route.params.productId : null;

  const editProduct = userProducts.find((prod) => prod.id === prodId);

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editProduct ? editProduct.title : '',
      imageUrl: editProduct ? editProduct.imageUrl : '',
      description: editProduct ? editProduct.description : '',
      price: '',
    },
    inputValidities: {
      title: editProduct ? true : false,
      imageUrl: editProduct ? true : false,
      description: editProduct ? true : false,
      price: editProduct ? true : false,
    },
    formIsValid: editProduct ? true : false,
  });

  const submithandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        {text: 'Okay'},
      ]);
      return;
    }
    seterror(null);
    setloading(true);
    try {
      if (editProduct) {
        await dispatch(
          updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.description,
          ),
        );
      } else {
        await dispatch(
          addProduct(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            +formState.inputValues.price,
            formState.inputValues.description,
          ),
        );
      }
      navigation.dispatch(CommonActions.goBack());
    } catch (error) {
      seterror(error.message);
    }
    setloading(false);
  }, [dispatch, formState]);

  useEffect(() => {
    if (error) {
      Alert.alert('something went erong', error, [{text: 'Okay'}]);
    }
  }, [error]);

  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState],
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={{margin: 20}}>
        <Input
          id="title"
          label="Title"
          errorText="Please enter a valid title!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editProduct ? editProduct.title : ''}
          initiallyValid={!!editProduct}
          required
        />
        <Input
          id="imageUrl"
          label="Image Url"
          errorText="Please enter a valid image url!"
          keyboardType="default"
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editProduct ? editProduct.imageUrl : ''}
          initiallyValid={!!editProduct}
          required
        />
        {editProduct ? null : (
          <Input
            id="price"
            label="Price"
            errorText="Please enter a valid price!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            required
            min={0.1}
          />
        )}
        <Input
          id="description"
          label="Description"
          errorText="Please enter a valid description!"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          numberOfLines={3}
          onInputChange={inputChangeHandler}
          initialValue={editProduct ? editProduct.description : ''}
          initiallyValid={!!editProduct}
          required
          minLength={5}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title={editProduct ? 'Edit' : 'Add'}
          color={colors.accent}
          onPress={submithandler}
        />
      </View>
    </ScrollView>
  );
};

export default EditProductScreen;

const styles = StyleSheet.create({
  formControl: {width: '100%'},
  input: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 2,
    paddingVertical: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    margin: 10,
  },
});

export const editProductScreenOptions = (navData) => {
  const routeParams = navData.route.params ? navData.route.params : {};
  return {
    headerTitle: routeParams.productId ? 'Edit Product' : 'Add Product',
  };
};

// useEffect(() => {
//   navigation.dispatch(CommonActions.setParams({submit: submithandler}));
// }, [submithandler]);
// <KeyboardAvoidingView
//   style={{flex: 1}}
//   behavior="padding"
//   keyboardVerticalOffset={30}>
// const submitProd = () => {
//   // const {title, imageUrl, price, description} = product;
//   if (editProduct) {
//     console.log(title);
//     dispatch(updateProduct(prodId, title, imageUrl, description));
//   } else {
//     dispatch(addProduct(title, imageUrl, +price, description));
//   }
// };

// const submitFn = route.params.submit;

// useLayoutEffect(() => {
//   navigation.setOptions({
//     headerTitle: route.params.productId ? 'Edit Product' : 'Add Product',
//     headerRight: () => (
//       <Button onPress={submitFn} title="Save" color={colors.primary} />
//     ),
//   });
// }, [navigation]);

{
  /* <View style={{margin: 20}}>
<View style={styles.formControl}>
  <Text>Title</Text>
  <TextInput
    onChangeText={(text) => textChangeHandler('title', text)}
    value={formState.inputValues.title}
    style={styles.input}
    keyboardType="default"
    autoCapitalize="sentences"
    returnKeyType="next"
    autoCorrect
  />
  {!formState.inputValidities.title && (
    <Text>Please enter a title</Text>
  )}
</View>
<View style={styles.formControl}>
  <Text>Image url</Text>
  <TextInput
    onChangeText={(text) => textChangeHandler('imageUrl', text)}
    value={formState.inputValues.imageUrl}
    style={styles.input}
  />
</View>
{editProduct ? null : (
  <View style={styles.formControl}>
    <Text>Price</Text>
    <TextInput
      onChangeText={(text) => textChangeHandler('price', text)}
      value={formState.inputValues.price}
      style={styles.input}
      keyboardType="decimal-pad"
    />
  </View>
)}
<View style={styles.formControl}>
  <Text>Description</Text>
  <TextInput
    onChangeText={(text) => textChangeHandler('description', text)}
    value={formState.inputValues.description}
    style={styles.input}
  />
</View>
</View> */
}

// const textChangeHandler = (inputIdentifier, text) => {
//   let isValid = false;
//   if (text.trim().length > 0) {
//     isValid = true;
//   }
//   console.log(isValid);
//   dispatchFormState({
//     type: FORM_INPUT_UPDATE,
//     value: text,
//     input: inputIdentifier,
//     isValid: isValid,
//   });
// };

// const [titleVlid, settitleVlid] = useState(false);

// const [title, settitle] = useState(editProduct ? editProduct.title : '');
// const [imageUrl, setimageUrl] = useState(
//   editProduct ? editProduct.imageUrl : '',
// );
// const [price, setprice] = useState('');
// const [description, setdescription] = useState(
//   editProduct ? editProduct.description : '',
// );
