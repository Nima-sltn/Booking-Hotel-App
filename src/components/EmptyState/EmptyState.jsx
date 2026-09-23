import PropTypes from "prop-types";

/**
 * Friendly empty state used across lists (hotels, bookmarks, etc.).
 *
 * @param {{ icon?: import("react").ReactNode, title: string, hint?: string, children?: import("react").ReactNode }} props
 */
function EmptyState({ icon, title, hint, children }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
      {icon && (
        <span className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-indigo-50 text-indigo-500 dark:bg-indigo-950 dark:text-indigo-400">
          {icon}
        </span>
      )}
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {title}
      </h3>
      {hint && (
        <p className="mt-1 max-w-xs text-sm text-slate-400">{hint}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  hint: PropTypes.string,
  children: PropTypes.node,
};

export default EmptyState;
