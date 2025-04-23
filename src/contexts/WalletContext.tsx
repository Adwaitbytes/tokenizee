
import React, { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, WalletContextType } from '@/lib/wallet';
import { useToast } from '@/hooks/use-toast';

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const { toast } = useToast();

  // Check for connected wallet on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (window.arweaveWallet) {
          const permissions = await window.arweaveWallet.getPermissions();
          if (permissions.includes('ACCESS_ADDRESS')) {
            const addr = await window.arweaveWallet.getActiveAddress();
            setAddress(addr);
          }
        }
      } catch (error) {
        console.log("No wallet connected:", error);
      }
    };
    
    checkWalletConnection();
  }, []);

  const connect = async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    
    try {
      const addr = await connectWallet();
      setAddress(addr);
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Arweave wallet"
      });
      return addr;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: error instanceof Error ? error.message : "Failed to connect wallet",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      await disconnectWallet();
      setAddress(null);
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from Arweave wallet"
      });
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      toast({
        title: "Disconnect Failed",
        description: "Failed to disconnect wallet",
        variant: "destructive"
      });
    }
  };

  return (
    <WalletContext.Provider value={{
      address,
      isConnected: !!address,
      isConnecting,
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
