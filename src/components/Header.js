import React from "react";
// import { useAuth } from "../context/AuthContext"; // Assuming you have an AuthContext
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap 5 is included

const Header = ({ userProfile }) => {
  // const { userProfile } = useAuth(); // Get user data from AuthContext
  console.log(userProfile);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top border-bottom shadow-sm">
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* Logo */}
        <a href="/" className="navbar-brand">
          <img src="/logo.png" alt="Company Logo" style={{ height: "35px" }} />
        </a>

        {/* Application Name */}
        <h4 className="text-secondary text-center m-0">EHS WorkFlow</h4>

        {/* Logged-in User Email */}
        <div>
          {userProfile?.username ? (
            <h6 className="text-secondary m-0">{userProfile.username}</h6>
          ) : (
            <h6 className="text-secondary m-0">Guest</h6>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
