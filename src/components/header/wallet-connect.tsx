import { useState, useEffect } from 'react';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { KeplrWalletConnectV2 } from '@keplr-wallet/wc-client';
import { ethers } from 'ethers';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

// Configure all supported wallets
const providerOptions = {
  /* WalletConnect - Main connector for most wallets */
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'YOUR_INFURA_PROJECT_ID',
      qrcodeModalOptions: {
        mobileLinks: [
          'metamask',
          'trust',
          'okx',
          'exodus',
          'keplr',
          'leap',
          'compass',
          'ledger'
        ],
        desktopLinks: [
          'metamask',
          'keplr',
          'ledger'
        ]
      }
    }
  },
  
  /* Keplr Wallet */
  keplr: {
    package: KeplrWalletConnectV2,
    options: {
      chainId: 'cosmoshub-4'
    }
  },
  
  /* Leap Wallet */
  leap: {
    package: WalletConnectProvider,
    options: {
      infuraId: 'YOUR_INFURA_PROJECT_ID',
      qrcodeModalOptions: {
        mobileLinks: ['leap']
      }
    }
  },
  
  /* Ledger Live */
  ledger: {
    package: EthereumProvider,
    options: {
      infuraId: 'YOUR_INFURA_PROJECT_ID',
      chainId: 1
    }
  },
  
  /* Coinbase Wallet */
  coinbasewallet: {
    package: CoinbaseWalletSDK,
    options: {
      appName: 'Your DApp',
      infuraId: 'YOUR_INFURA_PROJECT_ID'
    }
  },
  
  /* Binance Chain Wallet */
  binancechainwallet: {
    package: true
  }
};

const WalletConnection = () => {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState('');
  const [chainId, setChainId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState('');
  const [walletType, setWalletType] = useState('');
  const [balance, setBalance] = useState('');

  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions,
    theme: 'dark',
    disableInjectedProvider: false,
  });

  // Check and verify connection
  const verifyConnection = async (provider) => {
    try {
      const accounts = await provider.listAccounts();
      const network = await provider.getNetwork();
      const balance = await provider.getBalance(accounts[0]);
      
      setIsConnected(accounts.length > 0);
      setAccount(accounts[0] || '');
      setChainId(network.chainId.toString());
      //@ts-ignore
      setBalance(ethers.utils.formatEther(balance));
      setConnectionError('');
      
      console.log(accounts)
      return accounts.length > 0;
    } catch (error) {
      console.error("Verification failed:", error);
      resetConnection();
      setConnectionError('Failed to verify connection');
      return false;
    }
  };

  // Connect wallet handler
  const connectWallet = async () => {
    try {
      const instance = await web3Modal.connect();
      //@ts-ignore
      const provider = new ethers.providers.Web3Provider(instance);
      setProvider(provider);
      setWalletType(web3Modal.cachedProvider);
      
      // Verify the connection
      const isVerified = await verifyConnection(provider);
      if (!isVerified) return;
      
      // Set up event listeners
      instance.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
        setIsConnected(accounts.length > 0);
        verifyConnection(provider);
      });

      instance.on('chainChanged', (chainId) => {
        setChainId(parseInt(chainId, 16).toString());
        verifyConnection(provider);
      });

      instance.on('disconnect', () => {
        resetConnection();
      });

    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError(error.message);
      resetConnection();
    }
  };

  // Reset connection
  const resetConnection = () => {
    setIsConnected(false);
    setAccount('');
    setChainId('');
    setProvider(null);
    setBalance('');
    web3Modal.clearCachedProvider();
  };

  // Verify ownership with signature
  const verifyOwnership = async () => {
    try {
      const signer = provider.getSigner();
      const signature = await signer.signMessage("Verify ownership");
      return signature;
    } catch (error) {
      setConnectionError('Verification failed');
      return null;
    }
  };

  // Check for existing connection on load
  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
    
    if (window.ethereum?.selectedAddress) {
      //@ts-ignore
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      verifyConnection(provider);
    }
  }, []);

  return (
    <div className="wallet-connector">
      {isConnected ? (
        <div className="connected-state">
          <div className="wallet-info">
            {/* <p><strong>Wallet Type:</strong> {walletType}</p>
            <p><strong>Account:</strong> {`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
            <p><strong>Chain ID:</strong> {chainId}</p> */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className='flex font-circular text-sm items-center space-x-2' variant="outline">
                  <p className=''>{balance} ETH</p>
                  <p className=''>{`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-56">
                  <DropdownMenuItem className='text-red-700'>
                    Close account
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={resetConnection}>
                    Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="wallet-actions">
            {/* <button onClick={async () => {
              const signature = await verifyOwnership();
              if (signature) {
                alert(`Verification successful!\nSignature: ${signature.slice(0, 10)}...`);
              }
            }}>
              Verify Ownership
            </button> */}
          </div>
        </div>
      ) : (
        <div className="disconnected-state">
          <Button onClick={connectWallet} className="bg-primary rounded-md py-4 px-6 font-circular text-white font-medium">Connect Wallet</Button>
          {connectionError && (
            <div className="error-message">
              {connectionError}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WalletConnection;