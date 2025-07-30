import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomRoutes from './bottom_routes';
import LinhasPorEmpresaScreen from '../screens/linhas_por_empresa';
import ViagensDaLinhaScreen from '../screens/viagens_da_linha';
import DetalheViagemScreen from '../screens/detalhe_viagem';
import AboutScreen from '../screens/about';

const PrivateRoutes = () => {
    const { Navigator, Screen } = createNativeStackNavigator();
    return (
        <Navigator 
            screenOptions={{ 
                headerShown: false,
                contentStyle: { backgroundColor: '#041C32' } 
            }}
        >
            <Screen name="HomeLayout" component={BottomRoutes} options={{ animation: 'fade'}} />
            <Screen name="LinhasPorEmpresa" component={LinhasPorEmpresaScreen} options={{ animation: 'slide_from_right' }} />
            <Screen name="ViagensDaLinha" component={ViagensDaLinhaScreen} options={{ animation: 'slide_from_right' }} />
            <Screen name="DetalheViagem" component={DetalheViagemScreen} options={{ animation: 'slide_from_right' }} />
            <Screen name="About" component={AboutScreen} options={{ animation: 'slide_from_right' }} />
        </Navigator>
    );
};

export default PrivateRoutes;