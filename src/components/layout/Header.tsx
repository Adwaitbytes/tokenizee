
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
  SheetClose 
} from "@/components/ui/sheet";

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { address, isConnected, connect } = useWallet();
  const isMobile = useIsMobile();

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
                <div className="py-4">
                  <div className="flex items-center mb-6">
                    <Link to="/" className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-lg w-8 h-8 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">N</span>
                      </div>
                      <span className="font-serif font-bold text-xl text-newsweave-primary">NewsWeave</span>
                    </Link>
                  </div>
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
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-serif font-bold text-xl text-newsweave-primary hidden md:inline">NewsWeave</span>
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
            <div className="relative max-w-md animate-fade-in">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search news..."
                className="pl-8 h-9 md:w-[200px] lg:w-[300px] rounded-full"
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
          
          <Button variant="ghost" size="icon" className="text-newsweave-text">
            <Bell className="h-5 w-5" />
          </Button>
          
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
