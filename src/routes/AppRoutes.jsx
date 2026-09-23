import { Route, Routes } from "react-router-dom";
import LocationList from "../components/LocationList/LocationList";
import Login from "../components/Login/Login";
import AppLayout from "../components/AppLayout/AppLayout";
import Hotels from "../components/Hotels/Hotels";
import SingleHotel from "../components/SingleHotel/SingleHotel";
import BookmarkLayout from "../components/BookmarkLayout/BookmarkLayout";
import Bookmark from "../components/Bookmark/Bookmark";
import SingleBookmark from "../components/SingleBookmark/SingleBookmark";
import AddNewBookmark from "../components/AddNewBookmark/AddNewBookmark";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import NotFound from "../components/NotFound/NotFound";

/**
 * Central route table — one place to see (and change) the whole URL map.
 *
 * `/`           home / all stays
 * `/login`      demo sign-in
 * `/hotels`     search list + map (`/:id` detail)
 * `/bookmark`   protected: list + map (`/:id` detail, `/add` new)
 * `*`           404
 */
function AppRoutes() {
  return (
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
  );
}

export default AppRoutes;
