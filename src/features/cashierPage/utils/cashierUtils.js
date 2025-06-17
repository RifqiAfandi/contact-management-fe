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

export const sortProducts = (products, sortBy, sortOrder) => {
  return [...products].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle null/undefined values
    if (!aValue && !bValue) return 0;
    if (!aValue) return sortOrder === "asc" ? 1 : -1;
    if (!bValue) return sortOrder === "asc" ? -1 : 1;

    if (sortBy === "sellingPrice") {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    } else if (sortBy === "productName" || sortBy === "category") {
      // Handle string comparison for alphabetical sorting
      aValue = aValue?.toString().toLowerCase() || "";
      bValue = bValue?.toString().toLowerCase() || "";
      
      return sortOrder === "asc" 
        ? aValue.localeCompare(bValue, 'id', { sensitivity: 'base' })
        : bValue.localeCompare(aValue, 'id', { sensitivity: 'base' });
    }

    // For numeric values
    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const filterAndSortProducts = (products, searchTerm, selectedCategory, sortBy, sortOrder) => {
  const filtered = filterProducts(products, searchTerm, selectedCategory);
  return sortProducts(filtered, sortBy, sortOrder);
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
