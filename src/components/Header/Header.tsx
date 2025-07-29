import { useRef, useState } from "react";
import { HiCalendar, HiMinus, HiPlus, HiSearch } from "react-icons/hi";
import { MdLocationOn, MdLogout } from "react-icons/md";
import useOutsideClick from "../../hooks/useOutsideClick";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRange, RangeKeyDict } from "react-date-range";
import { format } from "date-fns";
import {
  NavLink,
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

interface Options {
  adult: number;
  children: number;
  room: number;
}

interface DateSelection {
  startDate: Date;
  endDate: Date;
  key: string;
}

interface GuestOptionListProps {
  options: Options;
  handleOptions: (name: keyof Options, operation: 'inc' | 'dec') => void;
  setOpenOption: (open: boolean) => void;
}

interface OptionItemProps {
  type: keyof Options;
  options: Options;
  minLimit: number;
  handleOptions: (name: keyof Options, operation: 'inc' | 'dec') => void;
}

function Header() {
  const [searchParams] = useSearchParams();
  const [destination, setDestination] = useState<string>(
    searchParams.get("destination") || ""
  );
  const [openOption, setOpenOption] = useState<boolean>(false);
  const [options, setOptions] = useState<Options>({
    adult: 1,
    children: 0,
    room: 1,
  });
  const [date, setDate] = useState<DateSelection[]>([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState<boolean>(false);
  const dateRef = useRef<HTMLDivElement>(null);
  useOutsideClick(dateRef, "dateDropDown", () => setOpenDate(false));
  const navigate = useNavigate();

  const handleOptions = (name: keyof Options, operation: 'inc' | 'dec') => {
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
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem" ref={dateRef}>
          <HiCalendar className="headerIcon dateIcon" />
          <button
            className="dateDropDown"
            onClick={() => setOpenDate(!openDate)}>
            {`${format(date[0].startDate, "MM/dd/yyyy")} to ${format(
              date[0].endDate,
              "MM/dd/yyyy"
            )}`}
          </button>
          {openDate && (
            <DateRange
              className="date"
              onChange={(item: RangeKeyDict) => setDate([item.selection as DateSelection])}
              ranges={date}
              minDate={new Date()}
              moveRangeOnFirstSelection={true}
            />
          )}
          <span className="seperator"></span>
        </div>
        <div className="headerSearchItem">
          <button
            id="optionDropDown"
            onClick={() => setOpenOption(!openOption)}>
            {options.adult} adult &bull; {options.children} chilren &bull;
            {options.room} room
          </button>
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
      <User />
    </div>
  );
}

export default Header;

function GuestOptionList({ options, handleOptions, setOpenOption }: GuestOptionListProps) {
  const optionsRef = useRef<HTMLDivElement>(null);
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

function OptionItem({ type, options, minLimit, handleOptions }: OptionItemProps) {
  return (
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
  );
}

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
          <strong>{user!.name}</strong>
          <button>
            &nbsp;
            <MdLogout onClick={handleLogout} className="logout icon" />
          </button>
        </div>
      ) : (
        <NavLink to="/login">login</NavLink>
      )}
    </div>
  );
}
