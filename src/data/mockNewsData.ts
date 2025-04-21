
import { NewsItemProps } from "@/components/news/NewsCard";

export const mockNewsArticles: NewsItemProps[] = [
  {
    id: "1",
    title: "ArDrive Introduces New Storage Solutions for Decentralized Applications",
    content: "ArDrive has announced a new suite of developer tools for permanent storage solutions on Arweave. The tools aim to streamline integration processes for Web3 developers building applications with permanent data requirements.",
    category: "Web3",
    source: "Permaweb Digest",
    sourceUrl: "https://example.com/ardrive-news",
    timestamp: "2h ago",
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
    hash: "0x5a12bc7d55c11f8a9b3e69d2d3652c91a5c43e92",
  },
  {
    id: "2",
    title: "AI Model Outperforms Experts in Medical Diagnosis Challenge",
    content: "A new machine learning model developed by researchers at Stanford University has demonstrated superior diagnostic capabilities compared to human experts in a blind test. The AI correctly identified 97.3% of conditions from medical imaging data.",
    category: "AI",
    source: "Tech Insights",
    sourceUrl: "https://example.com/ai-medical-news",
    timestamp: "5h ago",
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    hash: "0x7b22bc7d55c11f8a9b3e69d2d3652c91a5c43f81",
  },
  {
    id: "3",
    title: "Climate Summit Results in Historic Agreement on Carbon Reduction",
    content: "Leaders from 195 countries have signed a landmark agreement to reduce carbon emissions by 45% by 2030. The agreement includes financial commitments to support developing nations in transitioning to renewable energy sources.",
    category: "Climate",
    source: "Global Monitor",
    sourceUrl: "https://example.com/climate-summit",
    timestamp: "8h ago",
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
    hash: "0x8c32bc7d55c11f8a9b3e69d2d3652c91a5c43a75",
  },
  {
    id: "4",
    title: "New Cryptocurrency Exchange Implements Zero-Knowledge Proofs for Privacy",
    content: "A new cryptocurrency exchange has launched with integrated zero-knowledge proof technology, allowing users to trade assets while maintaining complete privacy. The platform claims to be fully compliant with regulatory requirements.",
    category: "Crypto",
    source: "DeFi News",
    sourceUrl: "https://example.com/crypto-exchange-news",
    timestamp: "10h ago",
    verified: false,
    hash: "0x9d45bc7d55c11f8a9b3e69d2d3652c91a5c43b64",
  },
  {
    id: "5",
    title: "Research Shows 30% Increase in Remote Work Productivity",
    content: "A comprehensive study involving 5,000 workers across various industries has found that remote workers are, on average, 30% more productive than their office-based counterparts. The study controlled for factors such as job type and experience level.",
    category: "Business",
    source: "Work Insights",
    sourceUrl: "https://example.com/remote-work-study",
    timestamp: "12h ago",
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    hash: "0xad56bc7d55c11f8a9b3e69d2d3652c91a5c43c53",
  },
  {
    id: "6",
    title: "Scientists Discover New Approach to Quantum Computing Stability",
    content: "Researchers at MIT have developed a novel method to maintain quantum coherence for extended periods, potentially solving one of the biggest challenges in quantum computing. The breakthrough could accelerate the development of practical quantum computers.",
    category: "Science",
    source: "Quantum Review",
    sourceUrl: "https://example.com/quantum-breakthrough",
    timestamp: "1d ago",
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475",
    hash: "0xbe67bc7d55c11f8a9b3e69d2d3652c91a5c43d42",
  },
  {
    id: "7",
    title: "New Legislation Proposed for Data Privacy Protections",
    content: "A bipartisan group of senators has introduced comprehensive legislation aimed at strengthening consumer data privacy protections. The bill would establish a federal standard for data collection and usage practices across all industries.",
    category: "Policy",
    source: "Policy Watch",
    sourceUrl: "https://example.com/privacy-legislation",
    timestamp: "1d ago",
    verified: true,
    hash: "0xcf78bc7d55c11f8a9b3e69d2d3652c91a5c43e31",
  },
  {
    id: "8",
    title: "Decentralized Social Media Platform Surpasses 50 Million Users",
    content: "A Web3 social media platform built on blockchain technology has reached 50 million active users, marking a significant milestone for decentralized applications. The platform allows users to own their content and earn tokens for participation.",
    category: "Web3",
    source: "DWeb Reporter",
    sourceUrl: "https://example.com/social-milestone",
    timestamp: "2d ago",
    verified: false,
    imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    hash: "0xdf89bc7d55c11f8a9b3e69d2d3652c91a5c43f20",
  },
  {
    id: "9",
    title: "Revolutionary Battery Technology Extends EV Range by 70%",
    content: "A startup has unveiled a new battery technology that could extend electric vehicle ranges by up to 70% while reducing charging times by half. The technology uses sustainable materials and can be manufactured using existing production lines.",
    category: "Technology",
    source: "EV Journal",
    sourceUrl: "https://example.com/battery-breakthrough",
    timestamp: "2d ago",
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    hash: "0xef90bc7d55c11f8a9b3e69d2d3652c91a5c43a19",
  }
];

export const fetchNewsArticles = (): Promise<NewsItemProps[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockNewsArticles);
    }, 500);
  });
};

export const fetchArticleById = (id: string): Promise<NewsItemProps | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const article = mockNewsArticles.find(article => article.id === id);
      resolve(article);
    }, 300);
  });
};
