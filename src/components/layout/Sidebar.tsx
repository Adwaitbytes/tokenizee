
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Search, 
  Bell, 
  Mail,
  Bookmark, 
  User, 
  Coins,
  ListIcon,
  Settings,
  PlusCircle,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWallet } from "@/contexts/WalletContext";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const { address, isConnected, connect } = useWallet();

  const sidebarItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/discover" },
    { icon: Bell, label: "Notifications", path: "/notifications" },
    { icon: Mail, label: "Messages", path: "/messages" },
    { icon: Bookmark, label: "Bookmarks", path: "/bookmarks" },
    { icon: ListIcon, label: "Topics", path: "/topics" },
    { icon: Coins, label: "Tokens", path: "/token-portfolio" },
    { icon: User, label: "Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className={cn("w-64 px-2 flex flex-col h-full", className)}>
      <div className="py-2 px-3 mb-4">
        <Link to="/" className="flex items-center gap-3 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition">
          <div className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="text-xl font-bold">Tokenizee</span>
        </Link>
      </div>

      <nav className="space-y-1 mb-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-full text-lg font-medium transition-colors",
              isActive(item.path) 
                ? "font-bold text-black dark:text-white" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
            )}
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <Link to="/creator" className="w-full">
        <Button className="w-full rounded-full bg-newsweave-primary hover:bg-newsweave-secondary text-white py-6 font-bold text-lg mb-4">
          Create
        </Button>
      </Link>

      {!isConnected && (
        <Button 
          onClick={connect}
          className="w-full rounded-full mt-auto bg-newsweave-primary hover:bg-newsweave-secondary text-white"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export default Sidebar;
