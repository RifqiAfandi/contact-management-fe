import React from 'react';
import { CATEGORIES } from '../constants/config.js';

const CategoryFilter = ({ selectedCategory, setSelectedCategory }) => {
  const categories = [
    { key: CATEGORIES.ALL, label: 'Semua' },
    { key: CATEGORIES.MINUMAN, label: 'Minuman' },
    { key: CATEGORIES.MAKANAN, label: 'Makanan' },
    { key: CATEGORIES.SNACK, label: 'Snack' }
  ];

  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category.key}
          className={`category-btn ${
            selectedCategory === category.key ? "active" : ""
          }`}
          onClick={() => setSelectedCategory(category.key)}
        >
          {category.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
