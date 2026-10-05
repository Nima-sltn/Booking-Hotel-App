import PropTypes from "prop-types";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

/**
 * Calendar body of the header date picker, **code-split out of the entry
 * bundle**: react-date-range and its styles (the app's heaviest vendor
 * chunk) are only downloaded when the user actually opens the dropdown.
 *
 * @param {{ date: Array<object>, onChange: (item: object) => void }} props
 */
function DateRangePicker({ date, onChange }) {
  return (
    <DateRange
      onChange={onChange}
      ranges={date}
      minDate={new Date()}
      moveRangeOnFirstSelection
      dateDisplayFormat="MMM d, yyyy"
      rangeColors={["#4f46e5"]}
    />
  );
}

DateRangePicker.propTypes = {
  date: PropTypes.arrayOf(PropTypes.object).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateRangePicker;
