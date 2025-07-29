import { useNavigate } from "react-router-dom";
import useUrlLocation from "../../hooks/useUrlLocation";
import { useEffect, useState, FormEvent, MouseEvent } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import toast from "react-hot-toast";
import ReactCountryFlag from "react-country-flag";
import { useBookmark } from "../../context/BookmarkListContext";

const BASE_GEOCODING_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

interface GeoCodingData {
  countryCode: string;
  city?: string;
  locality?: string;
  countryName: string;
}

function AddNewBookmark() {
  const navigate = useNavigate();
  const [lat, lng] = useUrlLocation();
  const [cityName, setCityName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("");
  const [isLoadingGeoCoding, setIsLoadingGeoCoding] = useState<boolean>(false);
  const { createBookmark } = useBookmark();

  useEffect(() => {
    if (!lat || !lng) return;

    async function fetchLocationData() {
      setIsLoadingGeoCoding(true);
      try {
        const { data }: { data: GeoCodingData } = await axios.get(
          `${BASE_GEOCODING_URL}?latitude=${lat}&longitude=${lng}`
        );

        if (!data.countryCode)
          throw new Error(
            "this location is not a city, please click somewhere else"
          );

        setCityName(data.city || data.locality || "");
        setCountry(data.countryName);
        setCountryCode(data.countryCode);
      } catch (error: any) {
        toast.error(error.message, { style: { border: "1px solid red" } });
        setCountry("");
        setCityName("");
      } finally {
        setIsLoadingGeoCoding(false);
      }
    }
    fetchLocationData();
  }, [lat, lng]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cityName || !country || !lat || !lng) return;

    const newBookmark = {
      cityName,
      country,
      countryCode,
      latitude: Number(lat),
      longitude: Number(lng),
      host_location: cityName + " " + country,
    };
    await createBookmark(newBookmark);
    navigate("/bookmark");
  };

  if (isLoadingGeoCoding) return <Loader />;

  return (
    <>
      <h2>Add New Location</h2>
      <form className="form" onSubmit={handleSubmit}>
        <div className="formControl">
          <label htmlFor="cityName">CityName</label>
          <input
            value={cityName}
            onChange={(e) => {
              setCityName(e.target.value);
            }}
            type="text"
            name="cityName"
            id="cityName"
          />
        </div>
        <div className="formControl">
          <label htmlFor="country">Country</label>
          <input
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
            }}
            type="text"
            name="country"
            id="country"
          />
          <ReactCountryFlag className="flag" svg countryCode={countryCode} />
        </div>
        <div className="buttons">
          <button
            onClick={(e: MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              navigate(-1);
            }}
            className="btn btn--back">
            &larr; Back
          </button>
          <button className="btn btn--primary">Add</button>
        </div>
      </form>
    </>
  );
}

export default AddNewBookmark;
