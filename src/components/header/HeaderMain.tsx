import React from 'react';
import { Link } from 'react-router-dom';
import XionWalletConnect from './wallet-connect';
import { useXionWallet } from '../../context/xion-context';

const HeaderMain: React.FC = () => {
  const { isConnected } = useXionWallet();

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-white shadow-sm'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        {/* Logo */}
        <div className='flex items-center'>
          <Link to='/'>
            <img src='/images/logo.svg' alt='Cosmos' className='h-8' />
          </Link>
          <span className='ml-2 font-semibold'>Cosmos</span>
        </div>

        {/* Navigation */}
        <nav className='hidden md:flex items-center space-x-6'>
          <Link to='/dashboard' className='text-gray-700 hover:text-primary'>
            Dashboard
          </Link>
          <Link to='/jobs' className='text-gray-700 hover:text-primary'>
            Jobs
          </Link>
          <Link to='/freelancers' className='text-gray-700 hover:text-primary'>
            Freelancers
          </Link>
        </nav>

        {/* Wallet Connect Button - simple and clean */}
        <XionWalletConnect />
      </div>

      {/* Connection status indicator */}
      {isConnected && (
        <div className='bg-green-100 text-center py-1 text-xs text-green-800'>
          Connected via Xion Abstraction • Secure Smart Contract Interactions
          Enabled
        </div>
      )}
    </header>
  );
};

export default HeaderMain;
