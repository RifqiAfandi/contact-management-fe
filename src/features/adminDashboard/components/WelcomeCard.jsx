import React from "react";

const WelcomeCard = ({ title, text }) => {
  return (
    <div className="welcome-card">
      {title && <h3 className="welcome-title">{title}</h3>}
      <p className="welcome-text">{text}</p>
    </div>
  );
};

export default WelcomeCard;