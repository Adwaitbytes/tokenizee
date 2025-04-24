
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Wallet, LogIn, LogOut } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { address, isConnected, connect, disconnect, isConnecting } = useWallet();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
    }
  };

  const closeSheet = () => {
    setIsOpen(false);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "Create", path: "/creator" },
    { name: "Tokens", path: "/tokens" },
    { name: "How It Works", path: "/how-it-works" },
    { name: "For Writers", path: "/writers" },
    { name: "Community", path: "/community" },
    { name: "About", path: "/about" },
  ];

  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 4)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-xl font-serif font-bold flex items-center">
            <span className="text-newsweave-primary">News</span>
            <span>Weave</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="px-3 py-2 text-sm font-medium hover:text-newsweave-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Connect Wallet Button (Desktop) */}
          <div className="hidden md:flex items-center">
            {isConnected ? (
              <div className="flex items-center gap-2">
                <Link to="/tokens" className="flex items-center mr-2 text-sm hover:text-newsweave-primary">
                  <Wallet className="h-4 w-4 mr-1" />
                  Tokens
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center"
                  onClick={handleDisconnect}
                >
                  <span className="mr-1 font-mono">{shortenAddress(address!)}</span>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="bg-newsweave-primary flex items-center gap-1"
                onClick={handleConnect}
                disabled={isConnecting}
              >
                <LogIn className="h-4 w-4" />
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center border-b pb-4">
                  <Link to="/" className="text-xl font-serif font-bold" onClick={closeSheet}>
                    <span className="text-newsweave-primary">News</span>
                    <span>Weave</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={closeSheet}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <nav className="flex flex-col py-4 flex-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      className="px-2 py-3 hover:bg-slate-100 rounded-md"
                      onClick={closeSheet}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
                <div className="pt-4 border-t">
                  {isConnected ? (
                    <div className="space-y-3">
                      <Link 
                        to="/tokens" 
                        className="flex items-center px-2 py-3 hover:bg-slate-100 rounded-md w-full justify-center"
                        onClick={closeSheet}
                      >
                        <Wallet className="h-4 w-4 mr-2" />
                        View Token Portfolio
                      </Link>
                      <Button
                        variant="outline"
                        className="w-full justify-center"
                        onClick={() => {
                          handleDisconnect();
                          closeSheet();
                        }}
                      >
                        <span className="mr-1 font-mono">{shortenAddress(address!)}</span>
                        <LogOut className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full bg-newsweave-primary"
                      onClick={() => {
                        handleConnect();
                        closeSheet();
                      }}
                      disabled={isConnecting}
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
