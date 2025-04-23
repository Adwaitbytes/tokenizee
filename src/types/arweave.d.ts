
interface ArweaveWallet {
  getActiveAddress(): Promise<string>;
  connect(permissions: string[]): Promise<void>;
  disconnect(): Promise<void>;
  getPermissions(): Promise<string[]>;
}

interface Window {
  arweaveWallet?: ArweaveWallet;
}
