import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/Home';
import UserPage from '../screens/User';
import AllLinhasScreen from '../screens/all_linhas';
import FavoritosScreen from '../screens/favoritos';

const BottomRoutes = () => {
    const theme = { 
        gradientStart: '#041C32', 
        textSecondary: '#CCC', 
        buttonBackground: '#F9A826' 
    };
    const { Navigator, Screen } = createBottomTabNavigator();

    return (
        <Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: { 
                  position: 'absolute', 
                  bottom: 25, 
                  left: 20, 
                  right: 20,
                  borderRadius: 15, 
                  height: 60, 
                  backgroundColor: theme.gradientStart,
                  borderTopWidth: 0, 
                  elevation: 5
                },
                tabBarActiveTintColor: theme.buttonBackground,
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarIcon: ({ color, size, focused }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'bus';

                    if (route.name === 'Home') {
                        iconName = focused ? 'business' : 'business-outline';
                    } else if (route.name === 'Linhas') {
                        iconName = focused ? 'map' : 'map-outline';
                    } else if (route.name === 'Favoritos') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Perfil') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Screen name="Home" component={HomeScreen} />
            <Screen name="Linhas" component={AllLinhasScreen} />
            <Screen name="Favoritos" component={FavoritosScreen} />
            <Screen name="Perfil" component={UserPage} />
        </Navigator>
    );
};

export default BottomRoutes;