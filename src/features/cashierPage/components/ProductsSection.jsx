import React from 'react';
import SearchBox from './SearchBox.jsx';
import CategoryFilter from './CategoryFilter.jsx';
import LoadingState from './LoadingState.jsx';
import ErrorState from './ErrorState.jsx';
import EmptyState from './EmptyState.jsx';
import ProductGrid from './ProductGrid.jsx';

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
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} />
      ) : (
        <>
          {filteredProducts.length === 0 ? (
            <EmptyState />
          ) : (
            <ProductGrid filteredProducts={filteredProducts} addToCart={addToCart} />
          )}
        </>
      )}
    </section>
  );
};

export default ProductsSection;
