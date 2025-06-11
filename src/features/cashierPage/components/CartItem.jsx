import React from 'react';
import { DEFAULT_IMAGE } from '../constants/config.js';
import { formatCurrency, calculateItemTotal } from '../utils/formatUtils.js';

const CartItem = ({ item, onUpdateQuantity, onRemoveFromCart }) => {
  return (
    <div className="cart-item">
      <img
        src={item.productUrl || DEFAULT_IMAGE}
        alt={item.productName || "Product"}
        className="item-image"
        onError={(e) => {
          e.target.src = DEFAULT_IMAGE;
        }}
      />
      <div className="item-details">
        <h4 className="item-name">
          {item.productName || "Unknown Product"}
        </h4>
        <p className="item-price">
          {formatCurrency(item.price || item.sellingPrice)}
        </p>
      </div>
      <div className="item-quantity">
        <button
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
        >
          -
        </button>
        <span className="item-quantity-value">{item.quantity}</span>
        <button
          className="quantity-btn"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          +
        </button>
      </div>
      <span className="item-total">
        {formatCurrency(
          calculateItemTotal(
            item.price || item.sellingPrice,
            item.quantity
          )
        )}
      </span>
      <span
        className="remove-item"
        onClick={() => onRemoveFromCart(item.id)}
      >
        ×
      </span>
    </div>
  );
};

export default CartItem;
