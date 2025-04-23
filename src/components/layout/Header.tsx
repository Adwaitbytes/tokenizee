
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Search, User, Bell, Compass, List, BookOpen, Users } from "lucide-react";
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

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex items-center justify-between h-16 mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-newsweave-primary to-newsweave-secondary rounded-lg w-8 h-8 flex items-center justify-center">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            <span className="font-serif font-bold text-xl text-newsweave-primary hidden md:inline">NewsWeave</span>
          </Link>
        </div>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link to="/discover">
                <div className={`${navigationMenuTriggerStyle()} gap-1.5 ${isActive("/discover") ? "bg-accent/50" : ""}`}>
                  <Compass className="h-4 w-4" />
                  <span>Discover</span>
                </div>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/topics">
                <div className={`${navigationMenuTriggerStyle()} gap-1.5 ${isActive("/topics") ? "bg-accent/50" : ""}`}>
                  <List className="h-4 w-4" />
                  <span>Topics</span>
                </div>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/learn">
                <div className={`${navigationMenuTriggerStyle()} gap-1.5 ${isActive("/learn") ? "bg-accent/50" : ""}`}>
                  <BookOpen className="h-4 w-4" />
                  <span>Learn</span>
                </div>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/community">
                <div className={`${navigationMenuTriggerStyle()} gap-1.5 ${isActive("/community") ? "bg-accent/50" : ""}`}>
                  <Users className="h-4 w-4" />
                  <span>Community</span>
                </div>
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link to="/creator">
                <div className={`${navigationMenuTriggerStyle()} gap-1.5 ${isActive("/creator") ? "bg-accent/50" : ""}`}>
                  <span className="px-2 py-1 text-xs bg-newsweave-primary text-white rounded-full">New</span>
                  <span>Creator</span>
                </div>
              </Link>
            </NavigationMenuItem>
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
          <Link to="/profile">
            <Avatar className="h-8 w-8 border-2 border-newsweave-primary cursor-pointer">
              <AvatarFallback className="bg-newsweave-secondary text-white text-xs">
                AR
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
