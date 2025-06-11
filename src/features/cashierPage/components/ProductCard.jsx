import React from 'react';
import { DEFAULT_IMAGE } from '../constants/config.js';
import { formatCurrency } from '../utils/formatUtils.js';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div
      className="product-card"
      onClick={() => onAddToCart(product)}
    >
      <img
        src={product.productUrl || DEFAULT_IMAGE}
        alt={product.productName || "Product"}
        className="product-image"
        onError={(e) => {
          e.target.src = DEFAULT_IMAGE;
        }}
      />
      <div className="product-details">
        <h3 className="product-name">
          {product.productName || "Unknown Product"}
        </h3>
        <p className="product-price">
          {formatCurrency(product.sellingPrice)}
        </p>
        <p className="product-category">
          {product.category || "Unknown Category"}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
