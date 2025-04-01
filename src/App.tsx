import { BrowserRouter, Routes } from 'react-router-dom';
import Provider from './provider';
import { CustomRoutes } from './routes/routes';
import { AbstraxionProvider } from '@burnt-labs/abstraxion';
import { XionWalletProvider } from './context/xion-context';

// Import needed styles
import '@burnt-labs/abstraxion/dist/index.css';
import '@burnt-labs/ui/dist/index.css';

function App() {
  // Treasury configuration using environment variables
  const treasuryConfig = {
    treasury: import.meta.env.VITE_XION_TREASURY_ADDRESS,
    rpcUrl: import.meta.env.VITE_XION_RPC_URL,
    restUrl: import.meta.env.VITE_XION_REST_URL,
  };

  return (
    <>
      <BrowserRouter>
        <AbstraxionProvider config={treasuryConfig}>
          <XionWalletProvider>
            <Provider>
              <Routes>{...CustomRoutes()}</Routes>
            </Provider>
          </XionWalletProvider>
        </AbstraxionProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
