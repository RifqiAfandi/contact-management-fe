export const BACKEND_URL = import.meta.env.VITE_URL_BACKEND;

export const PRODUCT_CATEGORIES = [
  { value: "Minuman", label: "Minuman" },
  { value: "Makanan", label: "Makanan" },
  { value: "Snack", label: "Snack" },
];

export const API_ENDPOINTS = {
  PRODUCTS: "/api/products",
  USERS: "/api/auth/users",
  INVENTORY: "/api/inventory",
  TRANSACTIONS: "/api/transactions",
};

export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 5,
  PAGE_SIZE_OPTIONS: ["5", "10", "20", "50"],
  SHOW_SIZE_CHANGER: true,
  SHOW_QUICK_JUMPER: true,
};

export const VALIDATION_RULES = {
  PRODUCT_NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  PRICE: {
    MIN: 0,
    MAX: 10000000, // 10 million
  },
  IMAGE: {
    MAX_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  },
};
