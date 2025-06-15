import { BACKEND_URL } from '../constants/config.js';
import { logout } from '../../../utils/authUtils.js';

export const fetchProducts = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authentication token not found");
  }

  console.log("🔄 Fetching products from:", `${BACKEND_URL}/api/products`);
  
  const response = await fetch(`${BACKEND_URL}/api/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("📡 Response status:", response.status);

  if (!response.ok) {
    if (response.status === 401) {
      logout(); // Use centralized logout
      return;
    }
    throw new Error("Failed to fetch products");
  }

  const result = await response.json();
  console.log("📦 API Response:", result);

  if (result.isSuccess && result.data) {
    console.log("✅ Products loaded:", result.data.length);
    console.log("📋 Sample product:", result.data[0]);

    const mappedProducts = result.data.map((product) => ({
      ...product,
      price: product.sellingPrice,
      imageUrl: product.productUrl,
    }));

    console.log("🔄 Mapped product sample:", mappedProducts[0]);
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

  console.log("🛒 Sending transaction:", transactionData);
  
  const response = await fetch(`${BACKEND_URL}/api/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(transactionData),
  });

  console.log("📡 Response status:", response.status);

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error(
      `Server returned ${response.status} with non-JSON response`
    );
  }

  const result = await response.json();
  console.log("✅ Transaction result:", result);

  if (!response.ok) {
    if (response.status === 401) {
      logout(); // Use centralized logout
      return;
    }
    throw new Error(result.message || "Failed to process transaction");
  }

  if (!result.isSuccess) {
    throw new Error(result.message || "Failed to process transaction");
  }

  return result;
};
