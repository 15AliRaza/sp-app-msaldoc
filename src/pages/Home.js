import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/Initiator");
  }, []);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <h1>Welcome to EHS SharePoint Workflow App</h1>
          <p className="lead"></p>
        </div>
      </div>
    </div>
  );
};

export default Home;
