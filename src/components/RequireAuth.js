import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const { instance } = useMsal();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Save the current URL with query params in sessionStorage
      sessionStorage.setItem(
        "postLoginRedirect",
        location.pathname + location.search
      );

      // Redirect to login
      instance.loginRedirect();
    }
  }, [isAuthenticated, instance, location]);

  // If already authenticated, render the children
  return isAuthenticated ? children : null;
};

export default RequireAuth;
