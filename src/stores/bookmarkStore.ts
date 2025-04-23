
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Bookmark {
  articleId: string;
  dateAdded: string;
}

interface BookmarkStore {
  bookmarks: Bookmark[];
  addBookmark: (articleId: string) => void;
  removeBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (articleId) => {
        if (!get().isBookmarked(articleId)) {
          set((state) => ({ 
            bookmarks: [...state.bookmarks, {
              articleId,
              dateAdded: new Date().toISOString()
            }]
          }));
        }
      },
      removeBookmark: (articleId) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter(bookmark => bookmark.articleId !== articleId)
        }));
      },
      isBookmarked: (articleId) => {
        return get().bookmarks.some(bookmark => bookmark.articleId === articleId);
      }
    }),
    {
      name: "newsweave-bookmarks",
    }
  )
);
