import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanyBottomRoutes from './company_bottom_routes';
import ManageLinhaScreen from '../screens/manage_linha';
import LinhaDetailScreen from '../screens/linha_detail';
import ManageViagensScreen from '../screens/manage_viagens';
import AboutScreen from '../screens/about';

const CompanyPrivateRoutes = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator 
            screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: '#041C32' } 
            }}
        >
            <Screen name="CompanyHomeLayout" component={CompanyBottomRoutes} options={{ animation: 'fade'}} />
            <Screen name="ManageLinha" component={ManageLinhaScreen} options={{ animation: 'slide_from_bottom'}} />
            <Screen name="LinhaDetail" component={LinhaDetailScreen} options={{ animation: 'slide_from_right' }} />
            <Screen name="ManageViagens" component={ManageViagensScreen} options={{ animation: 'slide_from_right' }} />
            <Screen name="About" component={AboutScreen} options={{ animation: 'slide_from_right' }} />
        </Navigator>
    );
};

export default CompanyPrivateRoutes;