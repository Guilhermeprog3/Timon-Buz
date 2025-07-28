import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login_Screen';
import SignUpChoiceScreen from '../screens/SignUpChoice';
import SignUpPassengerScreen from '../screens/SignUpPassager';
import SignUpCompanyScreen from '../screens/SignUpCompany';
import VerifyEmailScreen from '../screens/Verify_email';

const PublicRoutes = () => {
  const { Navigator, Screen } = createNativeStackNavigator();

  return (
    <Navigator>
      <Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Screen name="SignUp" component={SignUpChoiceScreen} options={{ headerShown: false }} />
      <Screen name="SignUpPassenger" component={SignUpPassengerScreen} options={{ headerShown: false }} />
      <Screen name="SignUpCompany" component={SignUpCompanyScreen} options={{ headerShown: false }} />
      <Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ headerShown: false }} />
    </Navigator>
  );
};

export default PublicRoutes;