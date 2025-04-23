
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
}

interface ArticleStore {
  articles: Article[];
  addArticle: (article: Article) => void;
  getUserArticles: (address: string | null) => Article[];
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
      }
    }),
    {
      name: "newsweave-articles",
    }
  )
);
