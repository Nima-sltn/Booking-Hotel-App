import { useState } from "react";
import { HiCalendar, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import { MdLocationOn } from "react-icons/md";

function Header() {
  const [destination, setDestination] = useState("");
  const [openOption, setOpenoption] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });
  const handleOptions = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "inc" ? options[name] + 1 : options[name] - 1,
      };
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
          <div className="headerSearchItem">
            <HiCalendar className="headerIcon dateIcon" />
            <div className="dateDropDown">4/5/2024</div>

            <span className="seperator"></span>
          </div>
          <div className="headerSearchItem">
            <div id="optionDropDown" onClick={() => setOpenoption(!openOption)}>
              {options.adult} adult &bull; {options.children} chilren &bull;{" "}
              {options.room} room
            </div>
            {openOption && (
              <GuestOptionList
                handleOptions={handleOptions}
                options={options}
              />
            )}
            <span className="seperator"></span>
          </div>
          <div className="headerSearchItem">
            <button className="headerSearchBtn">
              <HiSearch className="headerIcon" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;

function GuestOptionList({ options, handleOptions }) {
  return (
    <>
      <div className="guestOptions">
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
