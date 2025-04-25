
import React from 'react';
import { WalletConnect } from '@/components/wallet/WalletConnect';

export const HeaderExtension: React.FC = () => {
  return (
    <div className="flex items-center ml-auto">
      <WalletConnect variant="small" />
    </div>
  );
};
