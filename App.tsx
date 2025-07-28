import React from 'react';
import { AuthProvider } from './src/context/authcontext';
import Routes from './src/routes/index';
import { MenuProvider } from 'react-native-popup-menu';
import { EmpresaProvider } from './src/context/empresacontext';
import { LinhaProvider } from './src/context/linhacontext';
import { ViagemProvider } from './src/context/viagemcontext';

const App: React.FC = () => {
  return (
      <MenuProvider>
        <AuthProvider>
          <EmpresaProvider>
            <LinhaProvider>
              <ViagemProvider>
                <Routes />
              </ViagemProvider>
            </LinhaProvider>
          </EmpresaProvider>
        </AuthProvider>
      </MenuProvider>
  );
};

export default App;