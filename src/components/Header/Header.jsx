import { useState } from "react";
import { HiCalendar, HiSearch } from "react-icons/hi";
import { MdLocationOn } from "react-icons/md";

function Header() {
  const [destination, setDestination] = useState("");

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
            <div id="optionDropDown">
              1 adult &bull; 2 chilren &bull; 1 room
            </div>
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
