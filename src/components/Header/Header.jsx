import { useCallback, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  HiCalendar,
  HiLocationMarker,
  HiLogout,
  HiMinus,
  HiPlus,
  HiSearch,
} from "react-icons/hi";
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

import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import CurrencySwitcher from "../CurrencySwitcher/CurrencySwitcher";

/**
 * App header: brand, navigation, search bar (destination / dates / guests),
 * currency switcher, theme toggle and the auth controls.
 */
function Header() {
  const [searchParams] = useSearchParams();

  const [destination, setDestination] = useState(
    searchParams.get("destination") || "",
  );
  const [openOption, setOpenOption] = useState(false);
  const [options, setOptions] = useState({ adult: 1, children: 0, room: 1 });
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openDate, setOpenDate] = useState(false);

  const dateRef = useRef();
  const closeDate = useCallback(() => setOpenDate(false), []);
  useOutsideClick(dateRef, "dateDropDown", closeDate);

  const navigate = useNavigate();

  const handleOptions = (name, operation) => {
    setOptions((prev) => ({
      ...prev,
      [name]: operation === "inc" ? prev[name] + 1 : prev[name] - 1,
    }));
  };

  const handleSearch = (event) => {
    event?.preventDefault?.();
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
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/85">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 lg:px-8">
        {/* Brand + navigation */}
        <div className="flex items-center gap-2 sm:gap-4">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/40">
              <HiLocationMarker className="h-5 w-5" />
            </span>
            <span className="hidden text-lg font-extrabold tracking-tight text-slate-900 dark:text-white sm:inline">
              Stay
              <span className="text-indigo-600 dark:text-indigo-400">
                Finder
              </span>
            </span>
          </NavLink>

          <nav className="flex items-center gap-1">
            <NavLink
              to="/hotels"
              className={({ isActive }) =>
                `rounded-lg px-2 py-2 text-sm font-medium transition sm:px-3 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                }`
              }>
              Explore
            </NavLink>
            <NavLink
              to="/bookmark"
              className={({ isActive }) =>
                `rounded-lg px-2 py-2 text-sm font-medium transition sm:px-3 ${
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
                }`
              }>
              Bookmarks
            </NavLink>
          </nav>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="order-3 flex w-full items-center rounded-2xl border border-slate-200 bg-white px-2 py-1.5 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-700 dark:bg-slate-900 dark:focus-within:ring-indigo-950 lg:order-none lg:w-auto lg:flex-1 lg:rounded-full">
          {/* Destination */}
          <div className="flex min-w-0 flex-1 items-center gap-2 px-2">
            <HiLocationMarker
              className="h-5 w-5 shrink-0 text-rose-500"
              aria-hidden="true"
            />
            <input
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              type="text"
              placeholder="Where to go?"
              className="w-full min-w-0 bg-transparent py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
              name="destination"
              id="destination"
            />
          </div>

          <span className="hidden h-6 w-px bg-slate-200 sm:block dark:bg-slate-700" />

          {/* Dates */}
          <div
            ref={dateRef}
            className="relative hidden items-center gap-2 px-2 sm:flex">
            <HiCalendar
              className="h-5 w-5 shrink-0 text-indigo-600 dark:text-indigo-400"
              aria-hidden="true"
            />
            <button
              id="dateDropDown"
              onClick={() => setOpenDate(!openDate)}
              type="button"
              className="whitespace-nowrap rounded-lg px-1 py-1 text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400">
              {`${format(date[0].startDate, "MMM d")} – ${format(
                date[0].endDate,
                "MMM d, yyyy",
              )}`}
            </button>

            {openDate && (
              <div className="absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-2xl bg-white shadow-2xl ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
                <DateRange
                  onChange={(item) => setDate([item.selection])}
                  ranges={date}
                  minDate={new Date()}
                  moveRangeOnFirstSelection
                  dateDisplayFormat="MMM d, yyyy"
                  rangeColors={["#4f46e5"]}
                />
              </div>
            )}
          </div>

          <span className="hidden h-6 w-px bg-slate-200 sm:block dark:bg-slate-700" />

          {/* Guests */}
          <div className="relative hidden items-center px-2 sm:flex">
            <button
              id="optionDropDown"
              onClick={() => setOpenOption(!openOption)}
              type="button"
              className="whitespace-nowrap rounded-lg px-1 py-1 text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400">
              {options.adult} adult · {options.children} child ·{" "}
              {options.room} room{options.room > 1 ? "s" : ""}
            </button>

            {openOption && (
              <GuestOptionList
                setOpenOption={setOpenOption}
                handleOptions={handleOptions}
                options={options}
              />
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            aria-label="Search stays"
            className="ml-1 shrink-0 rounded-xl bg-indigo-600 p-2.5 text-white shadow-sm shadow-indigo-600/40 transition hover:bg-indigo-500 active:scale-95 lg:rounded-full">
            <HiSearch className="h-5 w-5" />
          </button>
        </form>

        {/* Right controls */}
        <div className="order-2 ml-auto flex items-center gap-0.5 sm:gap-1 lg:order-none">
          <CurrencySwitcher />
          <ThemeToggle />
          <User />
        </div>
      </div>
    </header>
  );
}

export default Header;

function GuestOptionList({ options, handleOptions, setOpenOption }) {
  const optionsRef = useRef();
  const closeOptions = useCallback(() => setOpenOption(false), [
    setOpenOption,
  ]);
  useOutsideClick(optionsRef, "optionDropDown", closeOptions);

  return (
    <div
      ref={optionsRef}
      className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
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
    <div className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-b-0 dark:border-slate-800">
      <span className="flex-1 text-sm capitalize text-slate-600 dark:text-slate-300">
        {type}
      </span>

      <div className="flex items-center gap-2">
        <button
          className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300"
          onClick={() => handleOptions(type, "dec")}
          disabled={options[type] <= minLimit}
          aria-label={`Decrease ${type}`}
          type="button">
          <HiMinus className="h-4 w-4" />
        </button>

        <span className="w-5 text-center text-sm font-semibold tabular-nums text-slate-800 dark:text-slate-100">
          {options[type]}
        </span>

        <button
          className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
          onClick={() => handleOptions(type, "inc")}
          aria-label={`Increase ${type}`}
          type="button">
          <HiPlus className="h-4 w-4" />
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

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="hidden text-sm font-semibold text-slate-700 md:inline dark:text-slate-200">
          {user.name}
        </span>
        <span className="hidden h-8 w-8 place-items-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700 sm:grid dark:bg-indigo-950 dark:text-indigo-300">
          {user.name.charAt(0).toUpperCase()}
        </span>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out"
          title="Sign out"
          className="rounded-xl p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-500 dark:text-slate-400 dark:hover:bg-rose-950/40">
          <HiLogout className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <NavLink
      to="/login"
      className="ml-1 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-500">
      Log in
    </NavLink>
  );
}
