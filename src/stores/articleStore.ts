
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceUrl: string;
  category: string;
  imageUrl: string;
  timestamp: string;
  author: string;
  txId: string;
  // Add the missing properties required by NewsItemProps
  source: string;
  verified: boolean;
  hash?: string;
}

interface ArticleStore {
  articles: Article[];
  addArticle: (article: Article) => void;
  getUserArticles: (address: string | null) => Article[];
  getArticleById: (id: string) => Article | undefined;
}

export const useArticleStore = create<ArticleStore>()(
  persist(
    (set, get) => ({
      articles: [],
      addArticle: (article) => set((state) => ({ 
        articles: [article, ...state.articles] 
      })),
      getUserArticles: (address) => {
        if (!address) return [];
        return get().articles.filter(article => article.author === address);
      },
      getArticleById: (id) => {
        return get().articles.find(article => article.id === id);
      }
    }),
    {
      name: "newsweave-articles",
    }
  )
);
