import PropTypes from "prop-types";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

/**
 * Centered spinner with an accessible status label.
 * @param {{ label?: string }} props
 */
function Loader({ label = "Loading…" }) {
  return (
    <div
      role="status"
      className="flex items-center justify-center gap-2.5 px-4 py-10 text-slate-400">
      <AiOutlineLoading3Quarters
        className="h-5 w-5 animate-spin text-indigo-600 dark:text-indigo-400"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}

Loader.propTypes = {
  label: PropTypes.string,
};

export default Loader;
