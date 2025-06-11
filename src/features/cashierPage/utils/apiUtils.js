import { BACKEND_URL } from '../constants/config.js';

export const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${BACKEND_URL}/api/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
      return;
    }
    throw new Error("Failed to fetch products");
  }

  const result = await response.json();
  
  if (result.isSuccess && result.data) {
    const mappedProducts = result.data.map((product) => ({
      ...product,
      price: product.sellingPrice,
      imageUrl: product.productUrl,
    }));
    return mappedProducts;
  } else {
    throw new Error("Invalid response format");
  }
};

export const createTransaction = async (transactionData) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(`${BACKEND_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transactionData),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(
      `Server returned ${response.status} with non-JSON response`
    );
  }

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to process transaction");
  }

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to process transaction");
  }

  return result;
};
