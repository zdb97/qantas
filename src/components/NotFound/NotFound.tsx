import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./NotFound.scss";

const NotFound: React.FC = () => {
  useEffect(() => {
    document.title = `404 - Page Not Found`;
  }, []);

  return (
    <div className="not-found" role="alert" aria-live="assertive">
      <h1>404 - Page Not Found</h1>
      <Link to="/" className="back-link" aria-label="Back to home page">
        &larr; Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
