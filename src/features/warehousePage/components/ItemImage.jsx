import React from "react";
import ExpiryBadge from "./ExpiryBadge";

const ItemImage = ({ item }) => {
  return (
    <div className="item-image">
      <img src={item.imageUrl} alt={item.itemName} />
      <ExpiryBadge expiredDate={item.expiredDate} />
    </div>
  );
};

export default ItemImage;
