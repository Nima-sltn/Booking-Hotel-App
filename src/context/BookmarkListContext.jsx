import { useCallback, useEffect, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { BookmarkContext } from "./BookmarkContext";
import * as bookmarkService from "../services/bookmarkService";

const initialState = {
  bookmarks: [],
  isLoading: true,
  currentBookmark: null,
  error: null,
};

function bookmarkReducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true, error: null };
    case "bookmarks/loaded":
      return { ...state, isLoading: false, bookmarks: action.payload };
    case "bookmark/loaded":
      return { ...state, isLoading: false, currentBookmark: action.payload };
    case "bookmark/created":
      return {
        ...state,
        isLoading: false,
        bookmarks: [...state.bookmarks, action.payload],
        currentBookmark: action.payload,
      };
    case "bookmark/deleted":
      return {
        ...state,
        isLoading: false,
        bookmarks: state.bookmarks.filter((item) => item.id !== action.payload),
        currentBookmark: null,
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error(`Unknown bookmark action: ${action.type}`);
  }
}

/**
 * Owns bookmark state and all CRUD operations (JSON Server `/bookmarks`).
 * @param {{ children: import("react").ReactNode }} props
 */
export default function BookmarkListProvider({ children }) {
  const [{ bookmarks, isLoading, currentBookmark }, dispatch] = useReducer(
    bookmarkReducer,
    initialState,
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      dispatch({ type: "loading" });
      try {
        const data = await bookmarkService.getBookmarks();
        if (!cancelled) dispatch({ type: "bookmarks/loaded", payload: data });
      } catch (error) {
        if (cancelled) return;
        toast.error(error.message);
        dispatch({
          type: "rejected",
          payload: "An error occurred while loading bookmarks",
        });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const getBookmark = useCallback(async (id) => {
    dispatch({ type: "loading" });
    try {
      const bookmark = await bookmarkService.getBookmarkById(id);
      dispatch({ type: "bookmark/loaded", payload: bookmark });
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }, []);

  const createBookmark = useCallback(async (newBookmark) => {
    dispatch({ type: "loading" });
    try {
      const created = await bookmarkService.createBookmark(newBookmark);
      dispatch({ type: "bookmark/created", payload: created });
      return created;
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "rejected", payload: error.message });
      return null;
    }
  }, []);

  const deleteBookmark = useCallback(async (id) => {
    dispatch({ type: "loading" });
    try {
      await bookmarkService.deleteBookmark(id);
      dispatch({ type: "bookmark/deleted", payload: id });
    } catch (error) {
      toast.error(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      bookmarks,
      currentBookmark,
      getBookmark,
      deleteBookmark,
      createBookmark,
    }),
    [
      isLoading,
      bookmarks,
      currentBookmark,
      getBookmark,
      deleteBookmark,
      createBookmark,
    ],
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

BookmarkListProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
