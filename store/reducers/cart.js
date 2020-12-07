import CartItem from '../../models/cart';
import {ADD_ORDER} from '../action/order';
import {DELETE_PRODUCT} from '../action/product';
import {ADD_TO_CART, REMOVE_FROM_CART} from '../action/cart';

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.payload;
      const productTitle = addedProduct.title;
      const productPrice = addedProduct.price;

      let updateOrNewCartItem;

      if (state.items[action.payload.id]) {
        //  already in cart
        updateOrNewCartItem = new CartItem(
          state.items[action.payload.id].quantity + 1,
          productPrice,
          productTitle,
          state.items[action.payload.id].sum + productPrice,
        );
      } else {
        //  add product to cart
        updateOrNewCartItem = new CartItem(
          1,
          productPrice,
          productTitle,
          productPrice,
        );
      }
      return {
        ...state,
        items: {...state.items, [action.payload.id]: updateOrNewCartItem},
        totalAmount: state.totalAmount + productPrice,
      };

    case REMOVE_FROM_CART:
      const selectedCartItem = state.items[action.payload];
      let updatedCartitems;
      if (selectedCartItem.quantity > 1) {
        const updatedCartitem = new CartItem(
          selectedCartItem.quantity - 1,
          selectedCartItem.productPrice,
          selectedCartItem.productTitle,
          selectedCartItem.sum - selectedCartItem.price,
        );
        updatedCartitems = {...state.items, [action.payload]: updatedCartitem};
      } else {
        updatedCartitems = {...state.items};
        delete updatedCartitems[action.payload];
      }
      return {
        ...state,
        items: updatedCartitems,
        totalAmount: state.totalAmount - selectedCartItem.productPrice,
      };

    case DELETE_PRODUCT:
      if (!state.items[action.payload]) {
        return state;
      }
      const updatedItems = {...state.items};
      delete updatedItems[action.payload];

      return {
        ...state,
        items: updatedItems,
        totalAmount: state.totalAmount - state.items[action.payload].sum,
      };

    case ADD_ORDER:
      return initialState;

    default:
      return state;
  }
};
