import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 text-center">
          <h2>404 - Page Not Found</h2>
          <p>The page you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error;
