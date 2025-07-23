import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomRoutes from './bottom_routes';

const PrivateRoutes = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator>
            <Screen name="HomeLayout" component={BottomRoutes} options={{ headerShown: false, animation: 'fade'}} />
        </Navigator>
    );
};

export default PrivateRoutes;