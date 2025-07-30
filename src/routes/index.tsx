import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import PublicRoutes from './public_routes';
import PrivateRoutes from './private_routes';
import CompanyPrivateRoutes from './company_private_routes';
import { useAuth } from '../hooks/auth';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const AppRoutes = () => {
  const { session, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  if (session && profile) {
    if (profile.role === 'admin') {
      return <CompanyPrivateRoutes />;
    }
    return <PrivateRoutes />;
  }

  return <PublicRoutes />;
};

const Routes = () => {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0A1128',
  },
});

export default Routes;