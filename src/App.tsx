
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from './contexts/WalletContext';
import { Toaster } from 'sonner';

// Pages
import Index from './pages/Index';
import About from './pages/About';
import NotFound from './pages/NotFound';
import HowItWorks from './pages/HowItWorks';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import Licenses from './pages/Licenses';
import Community from './pages/Community';
import Writers from './pages/Writers';
import Curators from './pages/Curators';
import Developers from './pages/Developers';
import Learn from './pages/Learn';
import NewsDetail from './pages/NewsDetail';
import Discover from './pages/Discover';
import Creator from './pages/Creator';
import Profile from './pages/Profile';
import Topics from './pages/Topics';
import TokenPortfolio from './pages/TokenPortfolio';
import DAO from './pages/DAO';
import RewardsDashboard from './pages/RewardsDashboard';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1
    }
  }
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/writers" element={<Writers />} />
          <Route path="/curators" element={<Curators />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/community" element={<Community />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/licenses" element={<Licenses />} />
          <Route path="/news/:id" element={<NewsDetail />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/creator" element={<Creator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/token-portfolio" element={<TokenPortfolio />} />
          <Route path="/dao" element={<DAO />} />
          <Route path="/rewards" element={<RewardsDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" />
      </WalletProvider>
    </QueryClientProvider>
  );
}

export default App;
