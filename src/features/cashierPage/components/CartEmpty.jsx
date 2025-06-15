import React from 'react';

const CartEmpty = () => {
  return (
    <div className="cart-empty">
      <span className="empty-icon">🛒</span>
      <p className="empty-text">Keranjang kosong</p>
      <p className="empty-subtext">
        Pilih produk untuk ditambahkan ke keranjang
      </p>
    </div>
  );
};

export default CartEmpty;
