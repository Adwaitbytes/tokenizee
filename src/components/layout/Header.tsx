
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Search, 
  User, 
  Bell, 
  Menu,
  X,
  Home,
  Bookmark,
  Settings,
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useWallet } from "@/contexts/WalletContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { address, isConnected, connect } = useWallet();
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your token increased by 20%", time: "5m ago" },
    { id: 2, text: "New article available in your topics", time: "1h ago" },
    { id: 3, text: "Your tokens have been unlocked", time: "2h ago" },
  ]);

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/discover':
        return 'Explore';
      case '/topics':
        return 'Topics';
      case '/profile':
        return 'Profile';
      case '/creator':
        return 'Create';
      default:
        if (location.pathname.startsWith('/news/')) {
          return 'Article';
        }
        return 'Tokenizee';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between px-4 h-14">
        {isMobile ? (
          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="flex flex-col h-full">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-full w-8 h-8 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">T</span>
                      </div>
                      <span className="font-bold text-xl">Tokenizee</span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex-1 py-4">
                    <nav className="space-y-1 px-2">
                      <SheetClose asChild>
                        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-gray-100">
                          <Home className="h-6 w-6" />
                          <span className="text-lg">Home</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/discover" className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-gray-100">
                          <Search className="h-6 w-6" />
                          <span className="text-lg">Explore</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-gray-100">
                          <User className="h-6 w-6" />
                          <span className="text-lg">Profile</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/topics" className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-gray-100">
                          <Bookmark className="h-6 w-6" />
                          <span className="text-lg">Topics</span>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-full hover:bg-gray-100">
                          <Coins className="h-6 w-6" />
                          <span className="text-lg">Tokens</span>
                        </Link>
                      </SheetClose>
                    </nav>
                  </div>
                  {!isConnected && (
                    <div className="p-4 border-t">
                      <Button
                        onClick={() => {
                          connect();
                          document.body.click(); // Close sheet
                        }}
                        className="w-full bg-newsweave-primary hover:bg-newsweave-secondary"
                      >
                        Connect Wallet
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-bold">{getPageTitle()}</h1>
          </div>
        ) : (
          <h1 className="text-xl font-bold">{getPageTitle()}</h1>
        )}

        <div className="flex items-center gap-3">
          {isSearching ? (
            <div className="relative max-w-xs animate-fade-in">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search Tokenizee"
                className="pl-10 pr-4 h-10 w-full max-w-[280px] rounded-full border-gray-300"
                onBlur={() => setIsSearching(false)}
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                onClick={() => setIsSearching(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              onClick={() => setIsSearching(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 relative"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 rounded-lg shadow-lg" align="end">
              <div className="border-b px-4 py-3 font-medium">
                <h3 className="font-bold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className="px-4 py-3 border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                    >
                      <p className="text-sm mb-1">{notification.text}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-gray-500">
                    No new notifications
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          {isConnected ? (
            <Link to="/profile">
              <Avatar className="h-8 w-8 border-2 border-newsweave-primary cursor-pointer">
                <AvatarFallback className="bg-newsweave-secondary text-white text-xs">
                  AR
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="md:hidden rounded-full"
              onClick={connect}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
