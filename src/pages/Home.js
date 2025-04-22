import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1>Welcome to SharePoint React App</h1>
          <p className="lead">
            This application demonstrates how to integrate Microsoft
            authentication and SharePoint APIs in a React application.
          </p>

          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/login" className="btn btn-primary btn-lg">
              Get Started
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
