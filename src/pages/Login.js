import React, { useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Loading from "../components/Loading";

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
    } else {
      // login();
    }
  }, [isAuthenticated, navigate, redirectUrl]);

  return (
    <div className="container mt-5">
      <Loading />
    </div>
  );
};

export default Login;
