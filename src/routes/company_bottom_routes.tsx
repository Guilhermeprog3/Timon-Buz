import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import CompanyHomeScreen from '../screens/company_home';

const CompanyBottomRoutes = () => {
    const theme = { 
        gradientStart: '#041C32', textSecondary: '#CCC', buttonBackground: '#F9A826' 
    };
    const { Navigator, Screen } = createBottomTabNavigator();

    return (
        <Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { 
                  position: 'absolute', bottom: 25, left: 20, right: 20,
                  borderRadius: 15, height: 60, backgroundColor: theme.gradientStart,
                  borderTopWidth: 0, elevation: 5
                },
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
        </Navigator>
    );
};

export default CompanyBottomRoutes;