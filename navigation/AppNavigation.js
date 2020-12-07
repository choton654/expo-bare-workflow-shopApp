import React from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';

import {ShopNavigator, AuthNavigator} from './ShopNavigator';
import StartupScreen from '../screens/StartUpScreen';

const AppNavigator = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const didTryAutoLogin = useSelector((state) => state.auth.didTryAutoLogin);

  return (
    <NavigationContainer>
      {isAuth && <ShopNavigator />}
      {!isAuth && <AuthNavigator />}
      {!isAuth && <StartupScreen />}
    </NavigationContainer>
  );
};

export default AppNavigator;
// didTryAutoLogin &&
// !didTryAutoLogin &&
