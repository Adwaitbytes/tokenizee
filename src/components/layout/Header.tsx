
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Menu, 
  Search, 
  User, 
  Bell, 
  Compass, 
  List, 
  BookOpen, 
  Users, 
  Wallet,
  Coins,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
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
  const location = useLocation();
  const navigate = useNavigate();
  const { address, isConnected, connect } = useWallet();
  const isMobile = useIsMobile();
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your token increased by 20%", time: "5m ago" },
    { id: 2, text: "New article available in your topics", time: "1h ago" },
    { id: 3, text: "Your tokens have been unlocked", time: "2h ago" },
  ]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/discover", label: "Discover", icon: Compass },
    { path: "/topics", label: "Topics", icon: List },
    { path: "/learn", label: "Learn", icon: BookOpen },
    { path: "/community", label: "Community", icon: Users },
    { path: "/creator", label: "Creator", icon: null, badge: true },
    { path: "/profile", label: "Tokens", icon: Coins },
  ];

  const MobileNavItem = ({ path, label, icon: Icon, badge, closeSheet }: { 
    path: string; 
    label: string; 
    icon: any; 
    badge?: boolean;
    closeSheet: () => void;
  }) => (
    <Link to={path} onClick={closeSheet}>
      <div className={`flex items-center gap-3 px-4 py-3 rounded-md ${isActive(path) ? "bg-newsweave-primary/10 text-newsweave-primary font-medium" : "hover:bg-slate-100"}`}>
        {Icon && <Icon className="h-5 w-5" />}
        {badge && <span className="px-2 py-1 text-xs bg-newsweave-primary text-white rounded-full">New</span>}
        <span>{label}</span>
      </div>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <div className="flex items-center gap-4">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] sm:w-[300px]">
                <SheetHeader className="mb-6">
                  <SheetTitle>
                    <Link to="/" className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-lg w-8 h-8 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">T</span>
                      </div>
                      <span className="font-serif font-bold text-xl text-newsweave-primary">Tokenizee</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="space-y-1">
                  {navItems.map((item, idx) => (
                    <MobileNavItem 
                      key={idx} 
                      path={item.path} 
                      label={item.label} 
                      icon={item.icon} 
                      badge={item.badge}
                      closeSheet={() => document.body.click()} // This will close the sheet
                    />
                  ))}
                </nav>
                {!isConnected && (
                  <div className="mt-6 px-4">
                    <Button 
                      onClick={connect}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-newsweave-primary to-newsweave-secondary"
                    >
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="font-serif font-bold text-xl text-newsweave-primary hidden md:inline">Tokenizee</span>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navItems.map((item, idx) => (
              <NavigationMenuItem key={idx}>
                <Link to={item.path}>
                  <div className={`${navigationMenuTriggerStyle()} gap-1.5 ${isActive(item.path) ? "bg-accent/50" : ""}`}>
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.badge && <span className="px-2 py-1 text-xs bg-newsweave-primary text-white rounded-full">New</span>}
                    <span>{item.label}</span>
                  </div>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {isSearchOpen ? (
            <div className="relative animate-fade-in">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search content..."
                className="pl-8 h-9 w-[200px] rounded-full"
                onBlur={() => setIsSearchOpen(false)}
                autoFocus
              />
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSearchOpen(true)}
              className="text-newsweave-text"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="text-newsweave-text relative">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="border-b px-4 py-3 font-medium">
                Notifications
              </div>
              <div className="max-h-80 overflow-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div 
                      key={notification.id} 
                      className="px-4 py-3 border-b last:border-0 hover:bg-slate-50 cursor-pointer"
                    >
                      <p className="text-sm">{notification.text}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-muted-foreground">
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
              className="flex items-center gap-1"
              onClick={connect}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
