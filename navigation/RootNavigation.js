import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Color from '../constants/colors';
import CartScreen from '../screens/shop/CartScreen';
import OrderScreen from '../screens/shop/OrderScreen';
import ProductDetailsScreen from '../screens/shop/ProductDetailsScreen';
import ProductOverviewScreen from '../screens/shop/ProductOverviewScreen';
import StartUpScreen from '../screens/StartUpScreen';
import AuthScreen from '../screens/user/AuthScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import UserProductScreen from '../screens/user/UserProductScreen';
import {logout} from '../store/action/auth';

// const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const AdminStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Your Products"
        component={UserProductScreen}
        options={({route, navigation}) => ({
          headerRight: () => (
            <Button
              onPress={() => {
                navigation.navigate('Edit', {productId: null});
              }}
              title="Add"
              color={Color.primary}
            />
          ),
        })}
      />
      <Stack.Screen
        name="Edit"
        component={EditProductScreen}
        options={({route, navigation}) => {
          // const submitFn = route.params.submit;
          return {
            headerTitle: route.params.productId
              ? 'Edit Product'
              : 'Add Product',
            // headerRight: () => (
            //   <Button onPress={submitFn} title="Save" color={Color.primary} />
            // ),
          };
        }}
      />
    </Stack.Navigator>
  );
};

const ProductNavigation = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={({navigation}) => ({
          headerStyle: {backgroundColor: Color.primary},
          headerTintColor: 'white',
          headerLeft: () => (
            <Button
              onPress={() => {
                navigation.toggleDrawer();
              }}
              title="Open"
              color={Color.primary}
            />
          ),
          headerRight: () => (
            <Button
              onPress={() => {
                navigation.navigate('Products', {screen: 'Cart'});
              }}
              title="Cart"
              color={Color.primary}
            />
          ),
        })}
        name="All Products"
        component={ProductOverviewScreen}
      />
      <Stack.Screen
        options={({route}) => ({
          title: route.params.productTitle,
          headerStyle: {backgroundColor: Color.primary},
          headerTintColor: 'white',
        })}
        name="ProductDetails"
        component={ProductDetailsScreen}
      />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  return (
    <Drawer.Navigator
      drawerContent={(props) => {
        return (
          <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem
              label="Logout"
              onPress={() => {
                dispatch(logout());
                props.navigation.navigate('Auth');
              }}
            />
          </DrawerContentScrollView>
        );
      }}>
      <Drawer.Screen name="Products" component={ProductNavigation} />
      <Drawer.Screen name="Order" component={OrderScreen} />
      <Drawer.Screen name="Admin" component={AdminStack} />
    </Drawer.Navigator>
  );
};

const RootNavigation = () => {
  const {isLoggedIn} = useSelector((state) => state.auth);

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="StartUp" component={StartUpScreen} />
      {isLoggedIn ? (
        <Stack.Screen name="Home" component={Home} />
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{headerShown: true}}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigation;

// <HeaderButton
//   IconComponent={() => <Icon name="cart" size={30} color="#fff" />}
//   iconSize={23}
//   onPress={() => {
//     navigation.navigate('Cart');
//   }}
//   title="Info"
//   color="#fff"
// />
