import React from "react";
import { renderIcon } from "../utils/iconUtils";

const ModalHeader = ({ title, onClose }) => {
  return (
    <div className="modal-header">
      <h2 className="modal-title">{title}</h2>
      <button className="close-btn" onClick={onClose}>
        {renderIcon("close")}
      </button>
    </div>
  );
};

export default ModalHeader;