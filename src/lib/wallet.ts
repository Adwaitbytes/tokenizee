
// Basic wallet integration - to be expanded with actual Arweave wallet implementation
export interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
}

class WalletError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletError";
  }
}

export const connectWallet = async (): Promise<string> => {
  try {
    // Check if window.arweaveWallet exists
    if (!window.arweaveWallet) {
      throw new WalletError("ArConnect not found. Please install ArConnect.");
    }

    // Request permissions
    await window.arweaveWallet.connect([
      "ACCESS_ADDRESS",
      "SIGN_TRANSACTION",
      "ACCESS_PUBLIC_KEY",
    ]);

    // Get the wallet address
    const address = await window.arweaveWallet.getActiveAddress();
    
    return address;
  } catch (error) {
    console.error("Wallet connection error:", error);
    throw new WalletError(error instanceof Error ? error.message : "Failed to connect wallet");
  }
};

export const disconnectWallet = async (): Promise<void> => {
  if (window.arweaveWallet) {
    await window.arweaveWallet.disconnect();
  }
};
