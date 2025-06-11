export const formatCurrency = (amount) => {
  const numericAmount = parseFloat(amount) || 0;
  return `Rp ${numericAmount.toLocaleString("id-ID")}`;
};

export const calculateItemTotal = (price, quantity) => {
  const itemPrice = parseFloat(price) || 0;
  const itemQuantity = parseInt(quantity) || 0;
  return itemPrice * itemQuantity;
};

export const calculateCartTotal = (cart) => {
  return cart.reduce((total, item) => {
    const price = parseFloat(item.price || item.sellingPrice) || 0;
    const quantity = parseInt(item.quantity) || 0;
    return total + price * quantity;
  }, 0);
};

export const formatDateTime = () => {
  const now = new Date();
  return now.toLocaleString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const validateProduct = (product) => {
  return product && product.id && (product.price || product.sellingPrice);
};

export const mapProductForCart = (product) => {
  return {
    ...product,
    price: product.price || product.sellingPrice,
  };
};
