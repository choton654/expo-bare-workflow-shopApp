import Order from "../../models/order";

export const ADD_ORDER = "ADD_ORDER";
export const GET_ORDER = "GET_ORDER";
export const DELETE_ORDER = "DELETE_ORDER";

export const getOrders = () => async (dispatch, getState) => {
  const { token, userId } = getState().auth;
  try {
    const res = await fetch(
      `https://rn-shop-49cec-default-rtdb.firebaseio.com/orders/${userId}.json`
    );
    const data = await res.json();
    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    let fetchOrders = [];
    for (const key in data) {
      fetchOrders.push(
        new Order(
          key,
          data[key].cartItems,
          data[key].totalAmount,
          new Date(data[key].date)
        )
      );
    }

    dispatch({ type: GET_ORDER, payload: { fetchOrders } });
  } catch (error) {
    throw error;
  }
};

export const addToOrder = (cartItems, totalAmount) => async (
  dispatch,
  getState
) => {
  const date = new Date();
  const { token, userId } = getState().auth;
  try {
    const res = await fetch(
      `https://rn-shop-49cec-default-rtdb.firebaseio.com/orders/${userId}.json?auth=${token}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );
    const data = await res.json();
    console.log(data);
    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    dispatch({
      type: ADD_ORDER,
      payload: { id: data.name, item: cartItems, amount: totalAmount, date },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteOrder = (id) => async (dispatch, getState) => {
  const { token, userId } = getState().auth;
  try {
    const res = await fetch(
      `https://rn-shop-49cec-default-rtdb.firebaseio.com/orders/${userId}/${id}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );
    dispatch({ type: DELETE_ORDER, payload: { id } });
  } catch (err) {
    throw err;
  }
};
