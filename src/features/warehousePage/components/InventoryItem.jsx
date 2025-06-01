import React from "react";
import ItemImage from "./ItemImage";
import ItemDetails from "./ItemDetails";
import ItemActions from "./ItemActions";

const InventoryItem = ({ item, onEdit, onDelete }) => {
  return (
    <div className="inventory-item">
      <ItemImage item={item} />
      
      <div className="item-content">
        <div className="item-info">
          <h3 className="item-name">{item.itemName}</h3>
          <ItemDetails item={item} />
        </div>
        
        <ItemActions 
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
};

export default InventoryItem;