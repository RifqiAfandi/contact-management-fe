import React, { useState, useEffect } from "react";
import "./Kasir.css";

const BACKEND_URL = "http://localhost:3000"; // Replace with your backend URL

const Kasir = ({ user, onLogout }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/products`);
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const result = await response.json();
        if (result.isSuccess && result.data) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.servingType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add item to cart
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  // Update quantity
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  // Calculate totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  // Process payment
  const processPayment = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          paymentMethod,
          items: cart,
          total,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to process payment");
      }

      const data = await response.json();
      setLastTransaction(data.transaction);
      setShowReceipt(true);
      setCart([]);
      setCustomerName("");
      setPaymentMethod("cash");
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  const categories = ["All", "Makanan", "Minuman", "Snack"];

  return (
    <div className="kasir-container">
      {/* Header */}
      <header className="kasir-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">🏪</div>
            <div className="logo-text">
              <h1>Warung Digital</h1>
              <span>Point of Sale</span>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                ></circle>
              </svg>
            </div>
            <div className="user-details">
              <span className="user-name">
                Kasir: {user?.username || "Guest"}
              </span>
              <span className="user-time">
                {new Date().toLocaleString("id-ID")}
              </span>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={onLogout}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16,17 21,12 16,7"></polyline>
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
              ></line>
            </svg>
            Logout
          </button>
        </div>
      </header>

      <div className="kasir-main">
        {/* Products Section */}
        <div className="products-section">
          <div className="section-header">
            <h2>Daftar Produk</h2>
            <div className="search-filter">
              <div className="search-box">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                  ></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-filter"
              >
                {categories.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="product-card"
              >
                <div className="product-info">
                  <h3 className="product-name">{product.productName}</h3>
                  <p className="product-category">{product.servingType}</p>
                  <div className="product-price">
                    Rp {product.sellingPrice.toLocaleString("id-ID")}
                  </div>
                  {product.productUrl && (
                    <img
                      src={product.productUrl}
                      alt={product.productName}
                      className="product-image"
                    />
                  )}
                </div>
                <button
                  className="add-btn"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      name: product.productName,
                      price: product.sellingPrice,
                      category: product.servingType,
                    })
                  }
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line
                      x1="12"
                      y1="5"
                      x2="12"
                      y2="19"
                    ></line>
                    <line
                      x1="5"
                      y1="12"
                      x2="19"
                      y2="12"
                    ></line>
                  </svg>
                  Tambah
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="cart-section">
          <div className="section-header">
            <h2>Keranjang</h2>
            <span className="cart-count">{cart.length} item</span>
          </div>

          <div className="customer-input">
            <input
              type="text"
              placeholder="Nama Customer (opsional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-icon">🛒</div>
                <p>Keranjang kosong</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                >
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Rp {item.price.toLocaleString("id-ID")}</p>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="m19,6v14a2,2 0 0,1-2,2H7a2,2 0 0,1-2-2V6m3,0V4a2,2 0 0,1,2-2h4a2,2 0 0,1,2,2v2"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="item-total">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </div>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="cart-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="summary-row">
                <span>Pajak (10%):</span>
                <span>Rp {tax.toLocaleString("id-ID")}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>

              <div className="payment-method">
                <label>Metode Pembayaran:</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="cash">Tunai</option>
                  <option value="card">Kartu</option>
                  <option value="qris">QRIS</option>
                </select>
              </div>

              <button
                className="payment-btn"
                onClick={processPayment}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect
                    x="1"
                    y="3"
                    width="22"
                    height="18"
                    rx="2"
                    ry="2"
                  ></rect>
                  <line
                    x1="1"
                    y1="9"
                    x2="23"
                    y2="9"
                  ></line>
                </svg>
                Proses Pembayaran
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="receipt-modal">
          <div className="receipt-content">
            <div className="receipt-header">
              <h2>Struk Pembayaran</h2>
              <button
                className="close-btn"
                onClick={() => setShowReceipt(false)}
              >
                ×
              </button>
            </div>

            <div
              className="receipt-body"
              id="receipt-print"
            >
              <div className="receipt-info">
                <h3>Warung Digital</h3>
                <p>Jl. Raya No. 123, Kota</p>
                <p>Telp: (021) 1234-5678</p>
                <hr />
                <p>
                  <strong>No. Transaksi:</strong> {lastTransaction.id}
                </p>
                <p>
                  <strong>Tanggal:</strong> {lastTransaction.date}
                </p>
                <p>
                  <strong>Customer:</strong> {lastTransaction.customer}
                </p>
                <p>
                  <strong>Kasir:</strong> {lastTransaction.cashier}
                </p>
                <hr />
              </div>

              <div className="receipt-items">
                {lastTransaction.items.map((item) => (
                  <div
                    key={item.id}
                    className="receipt-item"
                  >
                    <div className="item-desc">
                      <span>{item.name}</span>
                      <span>
                        {item.quantity} x Rp{" "}
                        {item.price.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <span>
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
                <hr />
                <div className="receipt-total">
                  <div>
                    <span>Subtotal:</span>
                    <span>
                      Rp {lastTransaction.subtotal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div>
                    <span>Pajak:</span>
                    <span>
                      Rp {lastTransaction.tax.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="total">
                    <span>Total:</span>
                    <span>
                      Rp {lastTransaction.total.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>
                <hr />
                <p>
                  <strong>Metode Pembayaran:</strong>{" "}
                  {lastTransaction.paymentMethod.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="receipt-actions">
              <button
                className="print-btn"
                onClick={printReceipt}
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6,9 6,2 18,2 18,9"></polyline>
                  <path d="M6,18H4a2,2 0 0,1-2-2v-5a2,2 0 0,1,2-2H20a2,2 0 0,1,2,2v5a2,2 0 0,1-2,2H18"></path>
                  <rect
                    x="6"
                    y="14"
                    width="12"
                    height="8"
                  ></rect>
                </svg>
                Print Struk
              </button>
              <button
                className="new-transaction-btn"
                onClick={() => setShowReceipt(false)}
              >
                Transaksi Baru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kasir;
