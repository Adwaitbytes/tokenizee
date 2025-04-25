
import React from 'react';
import { Button } from "@/components/ui/button";
import { useWallet } from "@/contexts/WalletContext";
import { Loader2, Wallet, LogOut } from "lucide-react";

interface WalletConnectProps {
  variant?: "primary" | "outline" | "small";
  className?: string;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ 
  variant = "primary", 
  className = "" 
}) => {
  const { address, isConnected, isConnecting, connect, disconnect } = useWallet();
  
  // Format address for display
  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };
  
  if (isConnected && address) {
    // Connected state
    const buttonClass = variant === "primary" 
      ? "bg-green-600 hover:bg-green-700 text-white" 
      : variant === "outline"
        ? "bg-white border border-green-600 text-green-600 hover:bg-green-50"
        : "bg-white border border-green-600 text-green-600 hover:bg-green-50 text-xs h-8 px-3";
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className={`text-sm font-medium ${variant === "small" ? "hidden" : "mr-2"}`}>
            {formatAddress(address)}
          </span>
        </div>
        
        <Button
          variant="outline"
          size={variant === "small" ? "sm" : "default"}
          onClick={disconnect}
          className={`${buttonClass} ${className}`}
        >
          <LogOut className="h-4 w-4 mr-1" />
          {variant === "small" ? "" : "Disconnect"}
        </Button>
      </div>
    );
  }
  
  // Disconnected state
  const buttonClass = variant === "primary" 
    ? "bg-newsweave-primary hover:bg-newsweave-secondary text-white" 
    : variant === "outline"
      ? "bg-white border border-newsweave-primary text-newsweave-primary hover:bg-newsweave-primary/5"
      : "bg-white border border-newsweave-primary text-newsweave-primary hover:bg-newsweave-primary/5 text-xs h-8 px-3";
      
  return (
    <Button
      onClick={connect}
      disabled={isConnecting}
      className={`${buttonClass} ${className}`}
      size={variant === "small" ? "sm" : "default"}
    >
      {isConnecting ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Wallet className="h-4 w-4 mr-1" />
      )}
      {variant === "small" ? "" : "Connect Wallet"}
    </Button>
  );
};
