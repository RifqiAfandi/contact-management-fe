export const filterProducts = (products, searchTerm, selectedCategory) => {
  return products.filter((product) => {
    const matchesSearch = product.productName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
};

export const createTransactionPayload = (cart, user, paymentMethod, total, subTotal) => {
  return {
    item: cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: parseFloat(item.price || item.sellingPrice),
      productName: item.productName,
      category: item.category,
    })),
    total: parseFloat(total.toFixed(2)),
    subTotal: parseFloat(subTotal.toFixed(2)),
    paymentMethod,
    name: user.name || "Guest",
    description: `Transaction by ${user.name || "Guest"} with ${cart.length} items`,
  };
};

export const createReceiptData = (transactionResult, cart) => {
  return {
    id: transactionResult.data.transaction.id,
    date: new Date().toISOString(),
    total: transactionResult.data.transaction.total,
    subTotal: transactionResult.data.transaction.subTotal,
    paymentMethod: transactionResult.data.transaction.paymentMethod,
    customerName: transactionResult.data.transaction.name,
    items: cart.map((item) => ({
      ...item,
      total: item.quantity * (item.price || item.sellingPrice),
    })),
  };
};
