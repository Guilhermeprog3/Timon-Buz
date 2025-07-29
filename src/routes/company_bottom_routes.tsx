import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import CompanyHomeScreen from '../screens/company_home';
import CompanyUserScreen from '../screens/company_user';

const CompanyBottomRoutes = () => {
    const theme = { 
        gradientStart: '#041C32', 
        textSecondary: '#8E9BA4', 
        buttonBackground: '#F9A826' 
    };
    const { Navigator, Screen } = createBottomTabNavigator();

    return (
        <Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: theme.buttonBackground,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'apps';
                    if (route.name === 'Painel') iconName = focused ? 'apps' : 'apps-outline';
                    if (route.name === 'Perfil') iconName = focused ? 'person-circle' : 'person-circle-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Screen name="Painel" component={CompanyHomeScreen} />
            <Screen name="Perfil" component={CompanyUserScreen} />
        </Navigator>
    );
};

const styles = StyleSheet.create({
  tabBar: { 
    position: 'absolute', 
    bottom: 25, 
    left: 20, 
    right: 20,
    borderRadius: 20, 
    height: 65, 
    backgroundColor: 'rgba(4, 28, 50, 0.95)',
    borderTopWidth: 0, 
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  }
});

export default CompanyBottomRoutes;