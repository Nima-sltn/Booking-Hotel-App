import { Outlet } from "react-router-dom";
import CustomMap from "../Map/CustomMap";
import { useBookmark } from "../../context/BookmarkListContext";

function BookmarkLayout() {
  const { bookmarks } = useBookmark();
  return (
    <div className="appLayout">
      <div className="sidebar">
        <Outlet />
      </div>
      <CustomMap markerLocations={bookmarks} />
    </div>
  );
}

export default BookmarkLayout;
