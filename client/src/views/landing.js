import React from "react";
import { Link } from "react-router-dom";
import "./styles/landing.css"; // CSS dosyasını birazdan oluşturacağız

function Landing() {
  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">Welcome to Post Area!</h1>
        <p className="landing-subtitle">
          Share your thoughts and discover new posts instantly. Join our
          community today.
        </p>

        <div className="landing-buttons">
          <Link to="/login" className="btn-login">
            Login
          </Link>
          <Link to="/register" className="btn-register">
            Register Now
          </Link>
        </div>
      </div>

      <div className="landing-image">
        <img
          src="https://cdn-icons-png.flaticon.com/512/764/764619.png"
          alt="Messaging and Chat"
        />
      </div>
    </div>
  );
}

export default Landing;
