import React, { useState, useEffect } from "react";
import "./Kasir.css";

const BACKEND_URL = "http://localhost:3000"; // Replace with your backend URL

// Mock products data for demonstration
const mockProducts = [
  {
    id: 1,
    productName: "Coffee Latte",
    price: 25000,
    servingType: "Hot",
    imageUrl: "https://via.placeholder.com/150",
    stock: 20,
  },
  {
    id: 2,
    productName: "Cappuccino",
    price: 28000,
    servingType: "Hot",
    imageUrl: "https://via.placeholder.com/150",
    stock: 15,
  },
  {
    id: 3,
    productName: "Green Tea",
    price: 20000,
    servingType: "Cold",
    imageUrl: "https://via.placeholder.com/150",
    stock: 25,
  },
  {
    id: 4,
    productName: "Chocolate Frappe",
    price: 30000,
    servingType: "Cold",
    imageUrl: "https://via.placeholder.com/150",
    stock: 10,
  },
  {
    id: 5,
    productName: "Espresso",
    price: 18000,
    servingType: "Hot",
    imageUrl: "https://via.placeholder.com/150",
    stock: 30,
  },
  {
    id: 6,
    productName: "Matcha Latte",
    price: 27000,
    servingType: "Hot",
    imageUrl: "https://via.placeholder.com/150",
    stock: 12,
  },
];

const Kasir = ({ user, onLogout }) => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState(mockProducts); // Using mock data
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);

  // In a real app, you would fetch products from backend
  useEffect(() => {
    // Uncomment this to fetch from actual backend
    /*
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
    */
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
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(
        cart.map((item) =>
          item.id === id ? { ...item, quantity: quantity } : item
        )
      );
    }
  };

  // Calculate total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString("id-ID")}`;
  };

  // Handle checkout
  const handleCheckout = () => {
    const transaction = {
      id: Date.now(),
      items: [...cart],
      total: calculateTotal(),
      paymentMethod,
      date: new Date().toISOString(),
    };
    setLastTransaction(transaction);
    setShowReceipt(true);
  };

  const handleLogout = () => {
    window.location.href = "/login";
  };

  // Reset after transaction
  const resetTransaction = () => {
    setCart([]);
    setCustomerName("");
    setShowReceipt(false);
  };

  // Get current date and time
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="kasir-container">
      {/* Header */}
      <div className="kasir-header">
        <div className="header-left">
          <div className="logo">
            <div className="logo-icon">🛒</div>
            <div className="logo-text">
              <h1>Contact Caffe & Eatery</h1>
            </div>
          </div>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-avatar">
              {user?.username?.charAt(0).toUpperCase() || "G"}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.username || "Guest"}</div>
              <div className="user-role">{getCurrentDateTime()}</div>
            </div>
          </div>
          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="kasir-main">
        {/* Products Section */}
        <section className="products-section">
          <div className="section-header">
            <h2 className="section-title">Daftar Produk</h2>
          </div>

          <div className="controls">
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="category-filter">
              <button
                className={`category-btn ${
                  selectedCategory === "All" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("All")}
              >
                Semua
              </button>
              <button
                className={`category-btn ${
                  selectedCategory === "Hot" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("Hot")}
              >
                Hot
              </button>
              <button
                className={`category-btn ${
                  selectedCategory === "Cold" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("Cold")}
              >
                Cold
              </button>
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.length === 0 ? (
              <div className="no-products">No products found</div>
            ) : (
              filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => addToCart(product)}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.productName}
                    className="product-image"
                  />
                  <div className="product-details">
                    <h3 className="product-name">{product.productName}</h3>
                    <p className="product-price">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="product-stock">Stock: {product.stock}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Cart Section */}
        <section className="cart-section">
          <div className="cart-header">
            <h3 className="cart-title">Keranjang</h3>
            <p className="cart-subtitle">{cart.length} item</p>
          </div>

          <div className="cart-items">
            {cart.length === 0 ? (
              <div className="cart-empty">
                <span className="empty-icon">🛒</span>
                <p className="empty-text">Keranjang kosong</p>
                <p className="empty-subtext">
                  Pilih produk untuk ditambahkan ke keranjang
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="item-image"
                  />
                  <div className="item-details">
                    <h4 className="item-name">{item.productName}</h4>
                    <p className="item-price">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span className="item-quantity-value">{item.quantity}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <span className="item-total">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                  <span
                    className="remove-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    ×
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="cart-summary">
            <div className="payment-methods">
              <div
                className={`payment-method ${
                  paymentMethod === "cash" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("cash")}
              >
                Cash
              </div>
              <div
                className={`payment-method ${
                  paymentMethod === "card" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                Card
              </div>
              <div
                className={`payment-method ${
                  paymentMethod === "qris" ? "active" : ""
                }`}
                onClick={() => setPaymentMethod("qris")}
              >
                QRIS
              </div>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>
            <div className="summary-row">
              <span>Tax (10%)</span>
              <span>{formatCurrency(calculateTotal() * 0.1)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal() * 1.1)}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0}
            >
              Checkout
            </button>
          </div>
        </section>
      </main>

      {/* Receipt Modal */}
      {showReceipt && lastTransaction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="receipt">
              <div className="receipt-header">
                <h2 className="store-name">Warung Digital</h2>
                <p className="store-address">Jl. Contoh No. 123, Kota Contoh</p>
                <p className="receipt-date">
                  {new Date(lastTransaction.date).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="receipt-details">
                <div className="receipt-row">
                  <span>Customer:</span>
                  <span>{lastTransaction.customer}</span>
                </div>
                <div className="receipt-row">
                  <span>Transaction ID:</span>
                  <span>#{lastTransaction.id}</span>
                </div>
                <div className="receipt-row">
                  <span>Payment Method:</span>
                  <span>{lastTransaction.paymentMethod.toUpperCase()}</span>
                </div>
              </div>

              <div className="receipt-items">
                <div className="receipt-items-header">
                  <span>Product</span>
                  <span>Qty</span>
                  <span>Price</span>
                  <span>Total</span>
                </div>
                {lastTransaction.items.map((item) => (
                  <div
                    key={item.id}
                    className="receipt-item"
                  >
                    <span>{item.productName}</span>
                    <span>{item.quantity}</span>
                    <span>{formatCurrency(item.price)}</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-totals">
                <div className="receipt-total-row">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(lastTransaction.total)}</span>
                </div>
                <div className="receipt-total-row">
                  <span>Tax (10%):</span>
                  <span>{formatCurrency(lastTransaction.total * 0.1)}</span>
                </div>
                <div className="receipt-total-row grand-total">
                  <span>Grand Total:</span>
                  <span>{formatCurrency(lastTransaction.total * 1.1)}</span>
                </div>
              </div>

              <div className="receipt-footer">
                <p>Terima kasih telah berbelanja di Warung Digital</p>
              </div>

              <div className="receipt-actions">
                <button className="receipt-btn print-btn">Print Receipt</button>
                <button
                  className="receipt-btn close-btn"
                  onClick={resetTransaction}
                >
                  New Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kasir;
