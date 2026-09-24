import { HiMoon, HiSun } from "react-icons/hi";
import { useTheme } from "../../context/ThemeContext";

/**
 * Light/dark mode switch. The actual `.dark` class management lives
 * in ThemeProvider; this is only the trigger.
 */
function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="rounded-xl p-2 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
    >
      {isDark ? (
        <HiSun className="h-5 w-5" />
      ) : (
        <HiMoon className="h-5 w-5" />
      )}
    </button>
  );
}

export default ThemeToggle;
