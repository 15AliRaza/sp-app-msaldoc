import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import Loading from "../components/Loading";

const Login = () => {
  const { isAuthenticated, login } = useAuth();
  const [loginAttempted, setLoginAttempted] = useState(false);
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
    console.log(isAuthenticated, "ssdads");
    if (isAuthenticated) {
      const redirectUrl = searchParams.get("redirect") || "/";
      console.log("--------------------------------------", redirectUrl);
      navigate(redirectUrl); // Use React Router navigation
    } else {
      login();
    }
  }, [isAuthenticated, navigate, searchParams]);

  /*useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectUrl); // Will preserve the full URL with params
    } else {
      // login();
    }
  }, [isAuthenticated, navigate, redirectUrl]);*/

  return (
    <div className="container mt-5">
      <Loading />
    </div>
  );
};

export default Login;
