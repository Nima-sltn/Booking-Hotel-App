import { useCallback, useMemo, useReducer } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { STORAGE_KEYS } from "../config/env";

/**
 * Demo credentials (the app has no real backend auth; state is persisted
 * to localStorage so a refresh keeps the user signed in).
 */
const DEMO_USER = { name: "Nima", email: "nima@gmail.com", password: "1234" };

/** The safe subset of the user that gets persisted (never the password). */
const PUBLIC_USER = { name: DEMO_USER.name, email: DEMO_USER.email };

/**
 * Restore a previously persisted session, if any.
 * @returns {{ user: object|null, isAuthenticated: boolean }}
 */
function readStoredSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user);
    const user = raw ? JSON.parse(raw) : null;
    return { user, isAuthenticated: Boolean(user) };
  } catch {
    return { user: null, isAuthenticated: false };
  }
}

function authReducer(state, action) {
  switch (action.type) {
    case "login":
      return { user: action.payload, isAuthenticated: true };
    case "logout":
      return { user: null, isAuthenticated: false };
    default:
      throw new Error(`Unknown auth action: ${action.type}`);
  }
}

/**
 * Provides authentication state (login/logout) for the demo user.
 * @param {{ children: import("react").ReactNode }} props
 */
export default function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    authReducer,
    undefined,
    readStoredSession,
  );

  /**
   * Attempt to log in with email/password.
   * @returns {boolean} whether the credentials were accepted
   */
  const Login = useCallback((email, password) => {
    const ok =
      email.trim().toLowerCase() === DEMO_USER.email &&
      password === DEMO_USER.password;

    if (!ok) {
      toast.error("Invalid email or password");
      return false;
    }

    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(PUBLIC_USER));
    dispatch({ type: "login", payload: PUBLIC_USER });
    toast.success(`Welcome back, ${PUBLIC_USER.name}!`);
    return true;
  }, []);

  const Logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.user);
    dispatch({ type: "logout" });
    toast.success("Signed out");
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated, Login, Logout }),
    [user, isAuthenticated, Login, Logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
