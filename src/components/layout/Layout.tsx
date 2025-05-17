
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  showWidgets?: boolean;
}

export function Layout({ children, showSidebar = true, showWidgets = true }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-black">
      {showSidebar && (
        <Sidebar className="hidden md:flex sticky top-0 h-screen" />
      )}
      
      <div className={cn(
        "flex flex-col flex-1 min-w-0",
        !showWidgets && "max-w-full"
      )}>
        <Header />
        <main className="flex-1 border-x border-gray-200 dark:border-gray-800">
          {children}
        </main>
      </div>
      
      {showWidgets && (
        <div className="hidden lg:block w-80 shrink-0 pl-4 py-4 sticky top-0 h-screen overflow-y-auto">
          <div className="space-y-4 pr-4">
            {/* Widgets will be rendered here */}
            <div className="hidden xl:block">
              <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-4 mb-4">
                <h2 className="font-bold text-xl mb-4">What's happening</h2>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Trending in Technology</p>
                    <p className="font-bold">#Tokenization</p>
                    <p className="text-xs text-gray-500">1,234 posts</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Trending in Crypto</p>
                    <p className="font-bold">#Web3Content</p>
                    <p className="text-xs text-gray-500">5,678 posts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Layout;
