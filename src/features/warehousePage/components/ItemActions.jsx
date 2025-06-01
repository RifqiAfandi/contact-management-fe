import React from "react";
import { renderIcon } from "../utils/iconUtils";

const ItemActions = ({ item, onEdit, onDelete }) => {
  return (
    <div className="item-actions">
      <button 
        className="action-btn edit-btn" 
        onClick={() => onEdit(item)}
      >
        {renderIcon("edit")}
        Edit
      </button>
      <button
        className="action-btn delete-btn"
        onClick={() => onDelete(item.id)}
      >
        {renderIcon("delete")}
        Hapus
      </button>
    </div>
  );
};

export default ItemActions;