
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Header: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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

        <div className="hidden md:flex items-center space-x-1">
          <Button variant="ghost" className="text-sm font-medium">Discover</Button>
          <Button variant="ghost" className="text-sm font-medium">Topics</Button>
          <Button variant="ghost" className="text-sm font-medium">Learn</Button>
          <Button variant="ghost" className="text-sm font-medium">Community</Button>
        </div>

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
          <Avatar className="h-8 w-8 border-2 border-newsweave-primary">
            <AvatarFallback className="bg-newsweave-secondary text-white text-xs">
              AR
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
