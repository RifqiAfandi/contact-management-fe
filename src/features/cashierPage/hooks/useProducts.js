import { useState, useEffect } from 'react';
import { fetchProducts } from '../utils/apiUtils.js';
import { logout } from '../../../utils/authUtils.js';

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        if (error.message === "Authentication token not found") {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return { products, loading, error };
};
