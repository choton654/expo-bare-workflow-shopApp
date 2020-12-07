import Order from '../../models/order';
import {ADD_ORDER, GET_ORDER} from '../action/order';

const initialState = {
  orders: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ORDER:
      return {
        ...state,
        orders: action.payload.fetchOrders,
      };
    case ADD_ORDER:
      const newOrder = new Order(
        action.payload.id,
        action.payload.item,
        action.payload.amount,
        action.payload.date,
      );
      return {
        ...state,
        orders: state.orders.concat(newOrder),
      };

    default:
      return state;
  }
};
