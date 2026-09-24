import { Toaster } from "react-hot-toast";
import Header from "./components/Header/Header";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import AuthProvider from "./context/AuthProvider";
import BookmarkListProvider from "./context/BookmarkListContext";
import HotelsProvider from "./context/HotelsProvider";
import ThemeProvider from "./context/ThemeProvider";
import CurrencyProvider from "./context/CurrencyProvider";

/**
 * App shell. Provider order (outermost first):
 * theme -> auth -> bookmarks -> hotels -> currency -> UI.
 */
function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookmarkListProvider>
          <HotelsProvider>
            <CurrencyProvider>
              <Toaster position="top-center" />

              <div className="flex min-h-screen flex-col">
                <ErrorBoundary>
                  <Header />
                  <main className="flex min-h-0 flex-1 flex-col">
                    <AppRoutes />
                  </main>
                </ErrorBoundary>
              </div>
            </CurrencyProvider>
          </HotelsProvider>
        </BookmarkListProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
