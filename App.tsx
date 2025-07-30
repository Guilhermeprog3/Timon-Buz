import React from 'react';
import { AuthProvider } from './src/context/authcontext';
import Routes from './src/routes/index';
import { EmpresaProvider } from './src/context/empresacontext';
import { LinhaProvider } from './src/context/linhacontext';
import { ViagemProvider } from './src/context/viagemcontext';

const App: React.FC = () => {
  return (
        <AuthProvider>
          <EmpresaProvider>
            <LinhaProvider>
              <ViagemProvider>
                <Routes />
              </ViagemProvider>
            </LinhaProvider>
          </EmpresaProvider>
        </AuthProvider>
  );
};

export default App;