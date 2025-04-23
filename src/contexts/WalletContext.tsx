
import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, WalletContextType } from '@/lib/wallet';
import { useToast } from '@/components/ui/use-toast';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const connect = async () => {
    try {
      const addr = await connectWallet();
      setAddress(addr);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Arweave wallet"
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
    }
  };

  const disconnect = () => {
    disconnectWallet();
    setAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Successfully disconnected from Arweave wallet"
    });
  };

  return (
    <WalletContext.Provider value={{
      address,
      isConnected: !!address,
      connect,
      disconnect
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
