import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiLocationMarker } from "react-icons/hi";
import { useAuth } from "../../context/AuthContext";

/**
 * Login form. On success returns the user to the page they
 * originally requested (deep-link protection via ProtectedRoute).
 */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { Login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? "/";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email && password) Login(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="panel w-full max-w-md rounded-3xl p-8">
        <div className="mb-6 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/40">
            <HiLocationMarker className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Sign in to manage your bookmarks
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              autoComplete="email"
              name="email"
              id="email"
              required
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              name="password"
              id="password"
              required
              placeholder="••••••••"
              className="form-input"
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Sign in
          </button>
        </form>

        <div className="mt-5 rounded-xl bg-indigo-50 px-4 py-3 text-xs text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
          <p className="mb-1 font-bold uppercase tracking-wider">
            Demo account
          </p>
          <p>
            <code className="font-semibold">nima@gmail.com</code> · password{" "}
            <code className="font-semibold">1234</code>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
