import { createContext, useContext } from "react";

/**
 * Theme context object (component-free module for fast refresh).
 * @module context/ThemeContext
 */
export const ThemeContext = createContext(undefined);

/**
 * Access the current color mode and the toggle action.
 * @returns {{ mode: "light"|"dark", isDark: boolean, toggleTheme: () => void }}
 * @throws if used outside of {@link ThemeProvider}
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}
