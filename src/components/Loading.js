import React from "react";
import "../pages/Overlay.css";

const Loading = () => (
  <div className="container">
    {/* <div className="spinner-border" role="status">
      <span className="visually-hidden">Loading...</span>
    </div> */}
    <div className="overlay">
      <img src="/Loading.gif" alt="Loading..." className="loader" />
    </div>
  </div>
);

export default Loading;
