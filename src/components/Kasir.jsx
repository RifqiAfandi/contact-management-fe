import React, { useState, useEffect } from "react";
import "./Kasir.css";

const BACKEND_URL = "http://localhost:3000"; // Replace with your backend URL

const Kasir = ({ onLogout }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [showReceipt, setShowReceipt] = useState(false);
  const [lastTransaction, setLastTransaction] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(
          "🔄 Fetching products from:",
          `${BACKEND_URL}/api/products`
        );
        const response = await fetch(`${BACKEND_URL}/api/products`);

        console.log("📡 Response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();
        console.log("📦 API Response:", result);

        if (result.isSuccess && result.data) {
          console.log("✅ Products loaded:", result.data.length);
          console.log("📋 Sample product:", result.data[0]);

          // Map database fields to frontend expected fields
          const mappedProducts = result.data.map((product) => ({
            ...product,
            price: product.sellingPrice, // Map sellingPrice to price
            imageUrl: product.productUrl, // Map productUrl to imageUrl
          }));

          console.log("🔄 Mapped product sample:", mappedProducts[0]);
          setProducts(mappedProducts);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (error) {
        console.error("❌ Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.productName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add item to cart
  const addToCart = (product) => {
    // Validate product data before adding to cart
    if (!product || !product.id || (!product.price && !product.sellingPrice)) {
      console.error("Invalid product data:", product);
      return;
    }

    // Ensure we use the correct price field
    const productWithPrice = {
      ...product,
      price: product.price || product.sellingPrice,
    };

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
      setCart([...cart, { ...productWithPrice, quantity: 1 }]);
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

  // Calculate total with validation
  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price || item.sellingPrice) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return total + price * quantity;
    }, 0);
  };

  // Format currency with validation
  const formatCurrency = (amount) => {
    // Handle undefined, null, or invalid values
    const numericAmount = parseFloat(amount) || 0;
    return `Rp ${numericAmount.toLocaleString("id-ID")}`;
  };

  // Handle checkout
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }

    if (!user || !user.id) {
      alert("Silahkan login terlebih dahulu untuk melakukan transaksi.");
      return;
    }

    setCheckoutLoading(true);
    try {
      const subTotal = calculateTotal();
      const total = subTotal;

      const transaction = {
        item: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: parseFloat(item.price || item.sellingPrice),
          productName: item.productName,
        })),
        total,
        subTotal,
        paymentMethod,
        name: user.name || "Guest",
        description: `Transaction by ${user.name || "Guest"} with ${
          cart.length
        } items`,
      };

      console.log("🛒 Sending transaction:", transaction);
      console.log("🔄 Endpoint:", `${BACKEND_URL}/api/transactions`);

      const response = await fetch(`${BACKEND_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(transaction),
      });

      // Log response status untuk debugging
      console.log("📡 Response status:", response.status);

      // Cek response type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(
          `Server returned ${response.status} with non-JSON response`
        );
      }

      const result = await response.json();
      console.log("✅ Transaction result:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to process transaction");
      }

      if (result.isSuccess) {
        setLastTransaction({
          id: result.data.transaction.id,
          date: new Date().toISOString(),
          total: result.data.transaction.total,
          subTotal: result.data.transaction.subTotal,
          paymentMethod: result.data.transaction.paymentMethod,
          customerName: result.data.transaction.name,
          items: cart.map((item) => ({
            ...item,
            total: item.quantity * (item.price || item.sellingPrice),
          })),
        });
        setShowReceipt(true);
        setCart([]);
      } else {
        throw new Error(result.message || "Failed to process transaction");
      }
    } catch (error) {
      console.error("❌ Error processing transaction:", error);
      alert(`Gagal memproses transaksi: ${error.message}`);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Reset after transaction
  const resetTransaction = () => {
    setCart([]);
    setShowReceipt(false);
    setLastTransaction(null);
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
              {user?.name?.charAt(0).toUpperCase() || "G"}
            </div>
            <div className="user-details">
              <div className="user-name">{user?.name || "Guest"}</div>
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
            </div>{" "}
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
                  selectedCategory === "Minuman" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("Minuman")}
              >
                Minuman
              </button>
              <button
                className={`category-btn ${
                  selectedCategory === "Makanan" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("Makanan")}
              >
                Makanan
              </button>
              <button
                className={`category-btn ${
                  selectedCategory === "Snack" ? "active" : ""
                }`}
                onClick={() => setSelectedCategory("Snack")}
              >
                Snack
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
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
                    {" "}
                    <img
                      src={
                        product.productUrl ||
                        "https://ik.imagekit.io/RifqiAfandi/no-image.jpg"
                      }
                      alt={product.productName || "Product"}
                      className="product-image"
                      onError={(e) => {
                        e.target.src =
                          "https://ik.imagekit.io/RifqiAfandi/no-image.jpg";
                      }}
                    />
                    <div className="product-details">
                      {" "}
                      <h3 className="product-name">
                        {product.productName || "Unknown Product"}
                      </h3>
                      <p className="product-price">
                        {formatCurrency(product.sellingPrice)}
                      </p>
                      <p className="product-category">
                        {product.category || "Unknown Category"}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
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
                  {" "}
                  <img
                    src={
                      item.productUrl ||
                      "https://ik.imagekit.io/RifqiAfandi/no-image.jpg"
                    }
                    alt={item.productName || "Product"}
                    className="item-image"
                    onError={(e) => {
                      e.target.src =
                        "https://ik.imagekit.io/RifqiAfandi/no-image.jpg";
                    }}
                  />
                  <div className="item-details">
                    <h4 className="item-name">
                      {item.productName || "Unknown Product"}
                    </h4>
                    <p className="item-price">
                      {formatCurrency(item.price || item.sellingPrice)}
                    </p>
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
                    {formatCurrency(
                      (parseFloat(item.price || item.sellingPrice) || 0) *
                        (parseInt(item.quantity) || 0)
                    )}
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
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>

            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkoutLoading}
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
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
                <h2 className="store-name">Contact Caffe & Eatery</h2>
                <p className="store-address">Jl. Contoh No. 123, Kota Contoh</p>
                <p className="receipt-date">
                  {new Date(lastTransaction.date).toLocaleString("id-ID")}
                </p>
              </div>

              <div className="receipt-details">
                <div className="receipt-row">
                  <span>Customer:</span>
                  <span>{lastTransaction.customerName}</span>
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
                    <span>{formatCurrency(item.total)}</span>
                  </div>
                ))}
              </div>

              <div className="receipt-totals">
                <div className="receipt-total-row">
                  <span>Sub Total:</span>
                  <span>{formatCurrency(lastTransaction.subTotal)}</span>
                </div>
                <div className="receipt-total-row grand-total">
                  <span>Total:</span>
                  <span>{formatCurrency(lastTransaction.total)}</span>
                </div>
              </div>

              <div className="receipt-footer">
                <p>Terima kasih telah berbelanja di Contact Caffe & Eatery</p>
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
