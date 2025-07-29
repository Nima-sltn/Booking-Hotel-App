import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import { useHotels } from "../../context/HotelsProvider";
import { useEffect } from "react";

function SingleHotel() {
  const { id } = useParams<{ id: string }>();
  const { currentHotel: data, getHotel, isLoadingCurrHotel } = useHotels();

  useEffect(() => {
    if (id) getHotel(id);
  }, [id, getHotel]);

  if (isLoadingCurrHotel) return <Loader />;

  if (!data) return <div>Hotel not found</div>;

  return (
    <div className="room">
      <div className="roomDetail">
        <h2>{data.name}</h2>
        <div>
          {data.number_of_reviews} reviews &bull; {data.smart_location}
        </div>
        <img src={data.xl_picture_url} alt={data.name} />
      </div>
    </div>
  );
}

export default SingleHotel;
