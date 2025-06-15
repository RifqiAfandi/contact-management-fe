import React from 'react';
import ProductCard from './ProductCard.jsx';

const ProductGrid = ({ filteredProducts, addToCart }) => {
  return (
    <div className="products-grid">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
