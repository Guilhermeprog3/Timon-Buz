import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanyBottomRoutes from './company_bottom_routes';

const CompanyPrivateRoutes = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator>
            <Screen name="CompanyHomeLayout" component={CompanyBottomRoutes} options={{ headerShown: false, animation: 'fade'}} />
        </Navigator>
    );
};

export default CompanyPrivateRoutes;