import { useRef, useState } from "react";
import { HiCalendar, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import { MdLocationOn } from "react-icons/md";
import useOutsideClick from "../../hooks/useOutsideClick";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

function Header() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [destination, setDestination] = useState(
    searchParams.get("destination") || ""
  );
  const [openOption, setOpenOption] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);
  const dateRef = useRef();
  useOutsideClick(dateRef, "dateDropDown", () => setOpenDate(false));
  const navigate = useNavigate();
  // const [searchParams, setSearchParams] = useSearchParams();

  const handleOptions = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "inc" ? options[name] + 1 : options[name] - 1,
      };
    });
  };
  const handleSearch = () => {
    const encodedParams = createSearchParams({
      date: JSON.stringify(date),
      destination,
      options: JSON.stringify(options),
    });
    //note : =>  setSearchParams(encodedParams);
    navigate({
      pathname: "/hotels",
      search: encodedParams.toString(),
    });
  };

  return (
    <>
      <div className="header">
        <div className="headerSearch">
          <div className="headerSearchItem">
            <MdLocationOn className="headerIcon locationIcon" />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              type="text"
              placeholder="Where to go?"
              className="headerSearchInput"
              name="destination"
              id="destination"
            />
            <span className="seperator"></span>
          </div>
          <div className="headerSearchItem" ref={dateRef}>
            <HiCalendar className="headerIcon dateIcon" />
            <div
              className="dateDropDown"
              onClick={() => setOpenDate(!openDate)}>
              {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
                date[0].endDate,
                "MM/dd/yyyy"
              )}`}
            </div>
            {openDate && (
              <DateRange
                className="date"
                onChange={(item) => setDate([item.selection])}
                ranges={date}
                minDate={new Date()}
                moveRangeOnFirstSelection={true}
              />
            )}
            <span className="seperator"></span>
          </div>
          <div className="headerSearchItem">
            <div id="optionDropDown" onClick={() => setOpenOption(!openOption)}>
              {options.adult} adult &bull; {options.children} chilren &bull;
              {options.room} room
            </div>
            {openOption && (
              <GuestOptionList
                setOpenOption={setOpenOption}
                handleOptions={handleOptions}
                options={options}
              />
            )}
            <span className="seperator"></span>
          </div>
          <div className="headerSearchItem">
            <button className="headerSearchBtn" onClick={handleSearch}>
              <HiSearch className="headerIcon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

function GuestOptionList({ options, handleOptions, setOpenOption }) {
  const optionsRef = useRef();
  useOutsideClick(optionsRef, "optionDropDown", () => setOpenOption(false));

  return (
    <>
      <div className="guestOptions" ref={optionsRef}>
        <OptionItem
          handleOptions={handleOptions}
          type="adult"
          options={options}
          minLimit={1}
        />
        <OptionItem
          handleOptions={handleOptions}
          type="children"
          options={options}
          minLimit={0}
        />
        <OptionItem
          handleOptions={handleOptions}
          type="room"
          options={options}
          minLimit={1}
        />
      </div>
    </>
  );
}

function OptionItem({ type, options, minLimit, handleOptions }) {
  return (
    <>
      <div className="guestOptionItem">
        <span className="optionText">{type}</span>
        <div className="optionCounter">
          <button
            className="optionCounterBtn"
            onClick={() => handleOptions(type, "dec")}
            disabled={options[type] <= minLimit}>
            <HiMinus className="icon" />
          </button>
          <span className="optionCounterNumber">{options[type]}</span>
          <button
            className="optionCounterBtn"
            onClick={() => handleOptions(type, "inc")}>
            <HiPlus className="icon" />
          </button>
        </div>
      </div>
    </>
  );
}
