import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';
import HomeScreen from '../screens/Home';
import UserPage from '../screens/User';
import AllLinhasScreen from '../screens/all_linhas';
import FavoritosScreen from '../screens/favoritos';
import theme from "../colors/index"

const BottomRoutes = () => {
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


export default BottomRoutes;