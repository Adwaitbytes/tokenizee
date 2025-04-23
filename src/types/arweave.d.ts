
interface ArweaveWallet {
  getActiveAddress(): Promise<string>;
  connect(permissions: string[]): Promise<void>;
  disconnect(): Promise<void>;
}

interface Window {
  arweaveWallet?: ArweaveWallet;
}
