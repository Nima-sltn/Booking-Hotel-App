import { useRef, useState } from "react";
import { HiCalendar, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import { MdLocationOn, MdLogout } from "react-icons/md";
import PropTypes from "prop-types";
import useOutsideClick from "../../hooks/useOutsideClick";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRange } from "react-date-range";
import { format } from "date-fns";

import {
  NavLink,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useAuth } from "../../context/AuthProvider";

function Header() {
  const [searchParams] = useSearchParams();

  const [destination, setDestination] = useState(
    searchParams.get("destination") || "",
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

  const handleOptions = (name, operation) => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "inc" ? prev[name] + 1 : prev[name] - 1,
    }));
  };

  const handleSearch = () => {
    const encodedParams = createSearchParams({
      date: JSON.stringify(date),
      destination,
      options: JSON.stringify(options),
    });

    navigate({
      pathname: "/hotels",
      search: encodedParams.toString(),
    });
  };

  return (
    <div className="header">
      <NavLink to="/bookmark">Bookmarks</NavLink>

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

          <span className="seperator" />
        </div>

        <div className="headerSearchItem" ref={dateRef}>
          <HiCalendar className="headerIcon dateIcon" />

          <button
            className="dateDropDown"
            onClick={() => setOpenDate(!openDate)}
            type="button">
            {`${format(
              date[0].startDate,
              "MM/dd/yyyy",
            )} to ${format(date[0].endDate, "MM/dd/yyyy")}`}
          </button>

          {openDate && (
            <DateRange
              className="date"
              onChange={(item) => setDate([item.selection])}
              ranges={date}
              minDate={new Date()}
              moveRangeOnFirstSelection
            />
          )}

          <span className="seperator" />
        </div>

        <div className="headerSearchItem">
          <button
            id="optionDropDown"
            onClick={() => setOpenOption(!openOption)}
            type="button">
            {options.adult} adult • {options.children} children • {options.room}{" "}
            room
          </button>

          {openOption && (
            <GuestOptionList
              setOpenOption={setOpenOption}
              handleOptions={handleOptions}
              options={options}
            />
          )}

          <span className="seperator" />
        </div>

        <div className="headerSearchItem">
          <button
            className="headerSearchBtn"
            onClick={handleSearch}
            type="button">
            <HiSearch className="headerIcon" />
          </button>
        </div>
      </div>

      <User />
    </div>
  );
}

export default Header;

function GuestOptionList({ options, handleOptions, setOpenOption }) {
  const optionsRef = useRef();

  useOutsideClick(optionsRef, "optionDropDown", () => setOpenOption(false));

  return (
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
  );
}

GuestOptionList.propTypes = {
  options: PropTypes.shape({
    adult: PropTypes.number.isRequired,
    children: PropTypes.number.isRequired,
    room: PropTypes.number.isRequired,
  }).isRequired,
  handleOptions: PropTypes.func.isRequired,
  setOpenOption: PropTypes.func.isRequired,
};

function OptionItem({ type, options, minLimit, handleOptions }) {
  return (
    <div className="guestOptionItem">
      <span className="optionText">{type}</span>

      <div className="optionCounter">
        <button
          className="optionCounterBtn"
          onClick={() => handleOptions(type, "dec")}
          disabled={options[type] <= minLimit}
          type="button">
          <HiMinus className="icon" />
        </button>

        <span className="optionCounterNumber">{options[type]}</span>

        <button
          className="optionCounterBtn"
          onClick={() => handleOptions(type, "inc")}
          type="button">
          <HiPlus className="icon" />
        </button>
      </div>
    </div>
  );
}

OptionItem.propTypes = {
  type: PropTypes.oneOf(["adult", "children", "room"]).isRequired,
  options: PropTypes.shape({
    adult: PropTypes.number.isRequired,
    children: PropTypes.number.isRequired,
    room: PropTypes.number.isRequired,
  }).isRequired,
  minLimit: PropTypes.number.isRequired,
  handleOptions: PropTypes.func.isRequired,
};

function User() {
  const navigate = useNavigate();
  const { user, isAuthenticated, Logout } = useAuth();

  const handleLogout = () => {
    Logout();
    navigate("/");
  };

  return (
    <div>
      {isAuthenticated ? (
        <div className="logoutContainer">
          <strong>{user.name}</strong>

          <button type="button" onClick={handleLogout}>
            <MdLogout className="logout icon" />
          </button>
        </div>
      ) : (
        <NavLink to="/login">login</NavLink>
      )}
    </div>
  );
}
