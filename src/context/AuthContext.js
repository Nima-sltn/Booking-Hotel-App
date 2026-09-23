import { createContext, useContext } from "react";

/**
 * Authentication context object.
 * Kept in a component-free module so fast refresh stays reliable.
 * @module context/AuthContext
 */
export const AuthContext = createContext(undefined);

/**
 * Access the current auth state and actions.
 * @returns {{ user: object|null, isAuthenticated: boolean, Login: Function, Logout: Function }}
 * @throws if used outside of {@link AuthProvider}
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
