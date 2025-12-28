import React from "react";
import error from "../imgs/error.png";
import "./error.css";
import { useNavigate } from "react-router-dom";

function Error() {
  const navigate = useNavigate();

  document.title = "Scalazon - Page Not Found"

  return (
    <>
      <div className="error-page">
        <p className="big-error">404</p>
        <p className="medium-error">Something went</p>
        <p className="wrong">WRONG!</p>
        <button
          onClick={() => {
            navigate("/");
          }}
          className="back-home"
        >
          Back to Homepage
        </button>
      </div>
    </>
  );
}

export default Error;
