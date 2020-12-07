import Product from '../../models/product';
import {
  ADD_PRODUCT,
  DELETE_PRODUCT,
  GET_PRODUCTS,
  UPDATE_PRODUCT,
} from '../action/product';

const initialState = {
  allProducts: [],
  userProducts: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_PRODUCTS:
      return {
        ...state,
        allProducts: action.payload.products,
        userProducts: action.payload.userProducts,
      };
    case DELETE_PRODUCT:
      return {
        ...state,
        allProducts: state.allProducts.filter(
          (product) => product.id !== action.payload,
        ),
        userProducts: state.userProducts.filter(
          (product) => product.id !== action.payload,
        ),
      };

    case ADD_PRODUCT:
      const newproduct = new Product(
        action.payload.id,
        action.payload.ownerId,
        action.payload.title,
        action.payload.imageUrl,
        action.payload.description,
        action.payload.price,
      );
      return {
        ...state,
        allProducts: state.allProducts.concat(newproduct),
        userProducts: state.userProducts.concat(newproduct),
      };

    case UPDATE_PRODUCT:
      const productIndex = state.userProducts.findIndex(
        (prod) => prod.id === action.payload.productId,
      );

      const updatedProduct = new Product(
        action.payload.productId,
        state.userProducts[productIndex].ownerId,
        action.payload.title,
        action.payload.imageUrl,
        action.payload.description,
        state.userProducts[productIndex].price,
      );
      console.log(updatedProduct);

      const availableProductIndex = state.allProducts.findIndex(
        (prod) => prod.id === action.payload.productId,
      );

      const updatedAvailableProducts = [...state.userProducts];
      updatedAvailableProducts[productIndex] = updatedProduct;

      const allAvailableProducts = [...state.allProducts];
      allAvailableProducts[availableProductIndex] = updatedProduct;
      return {
        ...state,
        allProducts: allAvailableProducts,
        userProducts: updatedAvailableProducts,
      };

    default:
      return state;
  }
};
