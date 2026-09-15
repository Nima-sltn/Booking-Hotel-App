import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import PropTypes from "prop-types";

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function authReducer(state, action) {
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

const FAKE_USER = {
  name: "Nima",
  email: "nima@gmail.com",
  password: "1234",
};

export default function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    authReducer,
    initialState,
  );

  const Login = useCallback((email, password) => {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({
        type: "login",
        payload: FAKE_USER,
      });
    }
  }, []);

  const Logout = useCallback(() => {
    dispatch({ type: "logout" });
  }, []);

  const authContextValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      Login,
      Logout,
    }),
    [user, isAuthenticated, Login, Logout],
  );

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  return useContext(AuthContext);
}
