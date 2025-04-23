
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface BookmarkStore {
  bookmarks: string[];
  addBookmark: (id: string) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set, get) => ({
      bookmarks: [],
      addBookmark: (id) => set((state) => ({
        bookmarks: [...state.bookmarks, id]
      })),
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter((bookmarkId) => bookmarkId !== id)
      })),
      isBookmarked: (id) => get().bookmarks.includes(id),
    }),
    {
      name: 'newsweave-bookmarks',
    }
  )
);
