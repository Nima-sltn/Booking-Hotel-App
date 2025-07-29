import { useNavigate, useParams } from "react-router-dom";
import { useBookmark } from "../../context/BookmarkListContext";
import { useEffect } from "react";
import Loader from "../Loader/Loader";
import ReactCountryFlag from "react-country-flag";

function SingleBookmark() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBookmark, isLoading, currentBookmark } = useBookmark();

  useEffect(() => {
    if (id) getBookmark(id);
  }, [id, getBookmark]);

  if (isLoading || !currentBookmark) return <Loader />;
  return (
    <>
      <button onClick={() => navigate(-1)} className="btn btn--back">
        &larr; back
      </button>
      <h2>{currentBookmark.cityName}</h2>
      <div className="bookmarkItem ">
        <ReactCountryFlag svg countryCode={currentBookmark.countryCode} />
        &nbsp; <strong>{currentBookmark.cityName}</strong> &nbsp;
        <span>{currentBookmark.country}</span>
      </div>
    </>
  );
}

export default SingleBookmark;
