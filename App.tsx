import React from 'react';
import { AuthProvider } from './src/context/authcontext';
import Routes from './src/routes/index';
import { MenuProvider } from 'react-native-popup-menu';
import { EmpresaProvider } from './src/context/empresacontext';
import { LinhaProvider } from './src/context/linhacontext';

const App: React.FC = () => {
  return (
      <MenuProvider>
        <AuthProvider>
          <EmpresaProvider>
            <LinhaProvider>
              <Routes />
            </LinhaProvider>
          </EmpresaProvider>
        </AuthProvider>
      </MenuProvider>
  );
};

export default App;