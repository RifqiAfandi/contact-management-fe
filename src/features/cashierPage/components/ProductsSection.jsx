import React from 'react';
import SearchBox from './SearchBox.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import ProductCard from './ProductCard.jsx';

const ProductsSection = ({ 
  products, 
  loading, 
  error, 
  searchTerm, 
  setSearchTerm, 
  selectedCategory, 
  setSelectedCategory, 
  filteredProducts, 
  addToCart 
}) => {
  return (
    <section className="products-section">
      <div className="section-header">
        <h2 className="section-title">Daftar Produk</h2>
      </div>

      <div className="controls">
        <SearchBox searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : error ? (
        <div className="error">{error}</div>
      ) : (
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-products">No products found</div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))
          )}
        </div>
      )}
    </section>
  );
};

export default ProductsSection;
