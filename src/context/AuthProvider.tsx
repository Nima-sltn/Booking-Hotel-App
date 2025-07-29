import { createContext, useContext, useMemo, useReducer, ReactNode } from "react";
import { User } from "../types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  Login: (email: string, password: string) => void;
  Logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

type AuthAction = 
  | { type: "login"; payload: User }
  | { type: "logout" };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

function authReducer(_state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "login":
      return {
        user: action.payload,
        isAuthenticated: true,
      };
    case "logout":
      return {
        user: null,
        isAuthenticated: false,
      };
    default:
      throw new Error("unknown action!");
  }
}

const FAKE_USER: User & { password: string } = {
  name: "Nima",
  email: "nima@gmail.com",
  password: "1234",
};

export default function AuthProvider({ children }: AuthProviderProps) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    authReducer,
    initialState
  );

  function Login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER });
  }

  function Logout() {
    dispatch({ type: "logout" });
  }

  const authContextValue = useMemo(
    () => ({ user, isAuthenticated, Login, Logout }),
    [user, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
