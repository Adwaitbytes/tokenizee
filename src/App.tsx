
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import { WalletProvider } from '@/contexts/WalletContext';

// Pages
import Index from '@/pages/Index';
import About from '@/pages/About';
import NotFound from '@/pages/NotFound';
import NewsDetail from '@/pages/NewsDetail';
import Creator from '@/pages/Creator';
import HowItWorks from '@/pages/HowItWorks';
import Topics from '@/pages/Topics';
import Community from '@/pages/Community';
import Curators from '@/pages/Curators';
import Writers from '@/pages/Writers';
import Developers from '@/pages/Developers';
import DAO from '@/pages/DAO';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Licenses from '@/pages/Licenses';
import Cookies from '@/pages/Cookies';
import TokenPortfolio from '@/pages/TokenPortfolio';

import './App.css';

function App() {
  return (
    <WalletProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/community" element={<Community />} />
          <Route path="/curators" element={<Curators />} />
          <Route path="/writers" element={<Writers />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/dao" element={<DAO />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/tokens" element={<TokenPortfolio />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </WalletProvider>
  );
}

export default App;
