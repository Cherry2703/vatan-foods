import React from "react";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="nf-container">
      <div className="nf-content">
        <h1 className="nf-title">404</h1>

        <p className="nf-subtitle">Oops! Page Not Found</p>

        <p className="nf-text">
          The page you're looking for doesn’t exist or may have been moved.
        </p>

        <a href="/" className="nf-button">
          Go Back Home
        </a>
      </div>

      <div className="nf-floating-circle"></div>
      <div className="nf-floating-circle small"></div>
    </div>
  );
}
