import { createContext, useContext } from "react";

/**
 * Bookmark list context object (component-free module for fast refresh).
 * @module context/BookmarkContext
 */
export const BookmarkContext = createContext(undefined);

/**
 * Access bookmark state and CRUD actions.
 * @throws if used outside of {@link BookmarkListProvider}
 */
export function useBookmark() {
  const ctx = useContext(BookmarkContext);
  if (ctx === undefined) {
    throw new Error("useBookmark must be used within a BookmarkListProvider");
  }
  return ctx;
}
