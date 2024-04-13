import { useParams } from "react-router-dom";
import useFetch from "./../../hooks/useFetch";
import Loader from "../Loader/Loader";
import { useHotels } from "../context/HotelsProvider";
import { useEffect } from "react";

function SingleHotel() {
  const { id } = useParams();
  const { currentHotel: data, getHotel, isLoadingCurrHotel } = useHotels();

  useEffect(() => {
    getHotel(id);
  }, [id]);

  if (isLoadingCurrHotel) return <Loader />;

  return (
    <>
      <div className="room">
        <div className="roomDetail">
          <h2>{data.name}</h2>
          <div>
            {data.number_of_reviews} reviews &bull; {data.smart_location}
          </div>
          <img src={data.xl_picture_url} alt={data.name} />
        </div>
      </div>
    </>
  );
}

export default SingleHotel;
