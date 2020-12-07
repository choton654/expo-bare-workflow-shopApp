import Product from '../../models/product';

export const DELETE_PRODUCT = 'DELETE_PRODUCT';
export const ADD_PRODUCT = 'ADD_PRODUCT';
export const UPDATE_PRODUCT = 'UPDATE_PRODUCT';
export const GET_PRODUCTS = 'GET_PRODUCTS';

export const getProducts = () => async (dispatch, getState) => {
  const {token, userId} = getState().auth;
  console.log(userId);
  try {
    const res = await fetch(
      'https://rn-shop-49cec-default-rtdb.firebaseio.com/products.json',
    );

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const data = await res.json();
    let products = [];
    for (const key in data) {
      products.push(
        new Product(
          key,
          data[key].ownerId,
          data[key].title,
          data[key].imageUrl,
          data[key].description,
          data[key].price,
        ),
      );
    }

    dispatch({
      type: GET_PRODUCTS,
      payload: {
        products,
        userProducts: products.filter((prod) => prod.ownerId === userId),
      },
    });
  } catch (error) {
    throw error;
  }
};

export const addProduct = (title, imageUrl, price, description) => async (
  dispatch,
  getState,
) => {
  const {token, userId} = getState().auth;
  try {
    const res = await fetch(
      `https://rn-shop-49cec-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
          title,
          imageUrl,
          price,
          description,
          ownerId: userId,
        }),
      },
    );
    const data = await res.json();
    dispatch({
      type: ADD_PRODUCT,
      payload: {
        id: data.name,
        title,
        imageUrl,
        price,
        description,
        ownerId: userId,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = (productId) => async (dispatch, getState) => {
  const {token} = getState().auth;
  try {
    const res = await fetch(
      `https://rn-shop-49cec-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'DELETE',
      },
    );

    if (!res.ok) {
      throw new Error('Something went wrong');
    }
    dispatch({type: DELETE_PRODUCT, payload: productId});
  } catch (error) {
    throw error;
  }
};

export const updateProduct = (
  productId,
  title,
  imageUrl,
  description,
) => async (dispatch, getState) => {
  const {token} = getState().auth;
  try {
    const res = await fetch(
      `https://rn-shop-49cec-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({title, imageUrl, description}),
      },
    );

    if (!res.ok) {
      throw new Error('Something went wrong');
    }

    const data = await res.json();
    dispatch({
      type: UPDATE_PRODUCT,
      payload: {productId, title, imageUrl, description},
    });
  } catch (error) {
    throw error;
  }
};
