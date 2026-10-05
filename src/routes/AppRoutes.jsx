import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import Loader from "../components/Loader/Loader";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";

/**
 * Page-level components are code-split: each route downloads only the code it
 * needs (Leaflet, the calendar, forms, …), keeping the initial bundle small.
 * Layouts and guards stay eager so navigation itself never flashes a spinner
 * for the shell.
 */
const LocationList = lazy(() => import("../components/LocationList/LocationList"));
const Login = lazy(() => import("../components/Login/Login"));
const AppLayout = lazy(() => import("../components/AppLayout/AppLayout"));
const Hotels = lazy(() => import("../components/Hotels/Hotels"));
const SingleHotel = lazy(() => import("../components/SingleHotel/SingleHotel"));
const BookmarkLayout = lazy(
  () => import("../components/BookmarkLayout/BookmarkLayout"),
);
const Bookmark = lazy(() => import("../components/Bookmark/Bookmark"));
const SingleBookmark = lazy(
  () => import("../components/SingleBookmark/SingleBookmark"),
);
const AddNewBookmark = lazy(
  () => import("../components/AddNewBookmark/AddNewBookmark"),
);
const NotFound = lazy(() => import("../components/NotFound/NotFound"));

/**
 * Central route table — one place to see (and change) the whole URL map.
 *
 * `/`           home / all stays
 * `/login`      demo sign-in
 * `/hotels`     search list + map (`/:id` detail)
 * `/bookmark`   protected: list + map (`/:id` detail, `/add` new)
 * `*`           404
 *
 * The `Suspense` boundary covers every lazy page; render crashes are caught
 * one level up by the top-level `ErrorBoundary`.
 */
function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center">
          <Loader label="Loading page…" />
        </div>
      }>
      <Routes>
        <Route path="/" element={<LocationList />} />
        <Route path="/login" element={<Login />} />

        <Route path="/hotels" element={<AppLayout />}>
          <Route index element={<Hotels />} />
          <Route path=":id" element={<SingleHotel />} />
        </Route>

        <Route
          path="/bookmark"
          element={
            <ProtectedRoute>
              <BookmarkLayout />
            </ProtectedRoute>
          }>
          <Route index element={<Bookmark />} />
          <Route path=":id" element={<SingleBookmark />} />
          <Route path="add" element={<AddNewBookmark />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default AppRoutes;
