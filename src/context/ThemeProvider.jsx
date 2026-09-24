import { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { ThemeContext } from "./ThemeContext";
import { STORAGE_KEYS } from "../config/env";

/**
 * Resolve the starting mode: an explicit stored choice wins,
 * otherwise fall back to the OS preference.
 * @returns {"light"|"dark"}
 */
function getInitialMode() {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.theme);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    /* storage unavailable */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * Theme engine: keeps `.dark` on <html> in sync with the resolved mode
 * and persists the user's choice across sessions.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function ThemeProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", mode === "dark");
    root.style.colorScheme = mode;
  }, [mode]);

  const toggleTheme = useCallback(
    () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    [],
  );

  const value = useMemo(
    () => ({ mode, isDark: mode === "dark", toggleTheme }),
    [mode, toggleTheme],
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.theme, mode);
    } catch {
      /* storage unavailable */
    }
  }, [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
