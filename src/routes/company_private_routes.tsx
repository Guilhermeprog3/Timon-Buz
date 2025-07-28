import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CompanyBottomRoutes from './company_bottom_routes';
import ManageLinhaScreen from '../screens/manage_linha';
import LinhaDetailScreen from '../screens/linha_detail';
import ManageViagensScreen from '../screens/manage_viagens';

const CompanyPrivateRoutes = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name="CompanyHomeLayout" component={CompanyBottomRoutes} options={{ animation: 'fade'}} />
            <Screen name="ManageLinha" component={ManageLinhaScreen} options={{ animation: 'slide_from_bottom'}} />
            <Screen name="LinhaDetail" component={LinhaDetailScreen} options={{ animation: 'slide_from_right' }} />
            <Screen name="ManageViagens" component={ManageViagensScreen} options={{ animation: 'slide_from_right' }} />
        </Navigator>
    );
};

export default CompanyPrivateRoutes;