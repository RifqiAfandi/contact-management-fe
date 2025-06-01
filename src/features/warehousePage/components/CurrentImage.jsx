import React from "react";

const CurrentImage = ({ imageUrl }) => {
  if (!imageUrl) return null;

  return (
    <div className="current-image-container">
      <span className="current-image-label">Gambar Saat Ini:</span>
      <div className="image-preview">
        <img src={imageUrl} alt="Current" />
      </div>
    </div>
  );
};

export default CurrentImage;