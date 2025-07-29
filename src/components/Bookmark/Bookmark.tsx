import ReactCountryFlag from "react-country-flag";
import { useBookmark } from "../../context/BookmarkListContext";
import Loader from "./../Loader/Loader";
import { Link } from "react-router-dom";
import { HiTrash } from "react-icons/hi";
import { MouseEvent } from "react";

function Bookmark() {
  const { isLoading, deleteBookmark, bookmarks, currentBookmark } =
    useBookmark();

  const handleDelete = async (e: MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    await deleteBookmark(id);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <h2>BookmarkList</h2>
      <div className="bookmarkList">
        {bookmarks.map((item) => {
          return (
            <Link
              key={item.id}
              to={`${item.id}?lat=${item.latitude}&lng=${item.longitude}`}>
              <div
                className={`bookmarkItem ${
                  item.id === currentBookmark?.id ? "current-bookmark" : ""
                }`}>
                <div>
                  <ReactCountryFlag svg countryCode={item.countryCode} />
                  &nbsp; <strong>{item.cityName}</strong> &nbsp;{" "}
                  <span>{item.country}</span>
                </div>
                <button onClick={(e) => handleDelete(e, item.id)}>
                  <HiTrash className="trash" />
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export default Bookmark;
