
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/contexts/WalletContext";
import { useState } from "react";
import Index from "./pages/Index";
import NewsDetail from "./pages/NewsDetail";
import NotFound from "./pages/NotFound";
import Discover from "./pages/Discover";
import Topics from "./pages/Topics";
import Learn from "./pages/Learn";
import Community from "./pages/Community";
import Creator from "./pages/Creator";
import Profile from "./pages/Profile";
import About from "./pages/About";
import HowItWorks from "./pages/HowItWorks";
import Developers from "./pages/Developers";
import DAO from "./pages/DAO";
import Writers from "./pages/Writers";
import Curators from "./pages/Curators";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Cookies from "./pages/Cookies";
import Licenses from "./pages/Licenses";

const App = () => {
  // Create a new QueryClient instance for each component instance
  const [queryClient] = useState(() => new QueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/discover" element={<Discover />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/community" element={<Community />} />
              <Route path="/creator" element={<Creator />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/news/:id" element={<NewsDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/developers" element={<Developers />} />
              <Route path="/dao" element={<DAO />} />
              <Route path="/writers" element={<Writers />} />
              <Route path="/curators" element={<Curators />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/licenses" element={<Licenses />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </WalletProvider>
    </QueryClientProvider>
  );
};

export default App;
