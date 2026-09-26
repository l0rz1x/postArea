import React from "react";
import { Link } from "react-router-dom";
import { Compass, Home } from "lucide-react";

export default function PageNotFound() {
  return (
    <div className="page-container not-found-page">
      <div className="not-found-card">
        <span className="not-found-badge">404</span>
        <h1 className="not-found-title">Page Not Found</h1>
        <p className="not-found-description">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={18} />
            <span>Go to Feed</span>
          </Link>
          <Link to="/landing" className="btn btn-secondary">
            <Compass size={18} />
            <span>Explore Landing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
