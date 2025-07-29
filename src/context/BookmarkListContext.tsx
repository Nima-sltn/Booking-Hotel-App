import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  ReactNode,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Bookmark } from "../types";

interface BookmarkState {
  bookmarks: Bookmark[];
  isLoading: boolean;
  currentBookmark: Bookmark | null;
  error: string | null;
}

interface BookmarkContextType {
  isLoading: boolean;
  bookmarks: Bookmark[];
  currentBookmark: Bookmark | null;
  getBookmark: (id: string) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  createBookmark: (newBookmark: Omit<Bookmark, 'id'>) => Promise<void>;
}

interface BookmarkListProviderProps {
  children: ReactNode;
}

type BookmarkAction = 
  | { type: "loading" }
  | { type: "bookmarks/loaded"; payload: Bookmark[] }
  | { type: "bookmark/loaded"; payload: Bookmark }
  | { type: "bookmark/created"; payload: Bookmark }
  | { type: "bookmark/deleted"; payload: string }
  | { type: "rejected"; payload: string };

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);
const BASE_URL = "http://localhost:5000";

const initialState: BookmarkState = {
  bookmarks: [],
  isLoading: false,
  currentBookmark: null,
  error: null,
};

function bookmarkReducer(state: BookmarkState, action: BookmarkAction): BookmarkState {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "bookmarks/loaded":
      return {
        ...state,
        isLoading: false,
        bookmarks: action.payload,
      };
    case "bookmark/loaded":
      return {
        ...state,
        isLoading: false,
        currentBookmark: action.payload,
      };
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
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("unknown action");
  }
}

function BookmarkListProvider({ children }: BookmarkListProviderProps) {
  const [{ bookmarks, isLoading, currentBookmark }, dispatch] = useReducer(
    bookmarkReducer,
    initialState
  );

  useEffect(() => {
    async function fetchBookmarkList() {
      dispatch({ type: "loading" });
      try {
        const { data } = await axios.get(`${BASE_URL}/bookmarks`);
        dispatch({ type: "bookmarks/loaded", payload: data });
      } catch (error: any) {
        toast.error(error.message);
        dispatch({
          type: "rejected",
          payload: "an Error occurred in loading bookmarks",
        });
      }
    }
    fetchBookmarkList();
  }, []);

  async function getBookmark(id: string): Promise<void> {
    if (id === currentBookmark?.id) return;

    dispatch({ type: "loading" });
    try {
      const { data } = await axios.get(`${BASE_URL}/bookmarks/${id}`);
      dispatch({ type: "bookmark/loaded", payload: data });
    } catch (error: any) {
      toast.error(error.message);
      dispatch({
        type: "rejected",
        payload: "an Error occurred in loading single bookmark",
      });
    }
  }

  async function createBookmark(newBookmark: Omit<Bookmark, 'id'>): Promise<void> {
    dispatch({ type: "loading" });
    try {
      const { data } = await axios.post(`${BASE_URL}/bookmarks/`, newBookmark);
      dispatch({ type: "bookmark/created", payload: data });
    } catch (error: any) {
      toast.error(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  async function deleteBookmark(id: string): Promise<void> {
    dispatch({ type: "loading" });
    try {
      await axios.delete(`${BASE_URL}/bookmarks/${id}`);
      dispatch({ type: "bookmark/deleted", payload: id });
    } catch (error: any) {
      toast.error(error.message);
      dispatch({ type: "rejected", payload: error.message });
    }
  }

  const bookmarkContextValue = useMemo(
    () => ({
      isLoading,
      bookmarks,
      currentBookmark,
      getBookmark,
      deleteBookmark,
      createBookmark,
    }),
    [isLoading, bookmarks, currentBookmark, getBookmark]
  );

  return (
    <BookmarkContext.Provider value={bookmarkContextValue}>
      {children}
    </BookmarkContext.Provider>
  );
}
export default BookmarkListProvider;

export function useBookmark(): BookmarkContextType {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error("useBookmark must be used within a BookmarkListProvider");
  }
  return context;
}
