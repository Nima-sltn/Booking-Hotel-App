import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../../context/AuthProvider";
import { useEffect } from "react";
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  return isAuthenticated ? children : null;
}
ProtectedRoute.propTypes = { children: PropTypes.node.isRequired };
export default ProtectedRoute;
