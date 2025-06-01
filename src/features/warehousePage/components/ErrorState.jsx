import React from "react";
import { renderIcon } from "../utils/iconUtils";

const ErrorState = ({ error }) => {
  return (
    <div className="error-state">
      <p>{error}</p>
      <button
        className="retry-button"
        onClick={() => window.location.reload()}
      >
        {renderIcon("refresh")} Coba Lagi
      </button>
    </div>
  );
};

export default ErrorState;