import React, { useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const redirectUrl = searchParams.get("redirect") || "/";

  /*useEffect(() => {
    if (isAuthenticated) {
      const origin = location.state?.from?.pathname || "/dashboard";
      navigate(origin);
    }
  }, [isAuthenticated, navigate, location]);*/

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl); // Will preserve the full URL with params
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h2>Welcome to SharePoint App</h2>
          <p>Please sign in to continue</p>
          <button onClick={login} className="btn btn-primary">
            Sign in with Microsoft
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
