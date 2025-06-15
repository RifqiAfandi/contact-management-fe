import React from 'react';
import CartItem from './CartItem.jsx';
import CartEmpty from './CartEmpty.jsx';

const CartItems = ({ cart, updateQuantity, removeFromCart }) => {
  if (cart.length === 0) {
    return <CartEmpty />;
  }

  return (
    <div className="cart-items">
      {cart.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={removeFromCart}
        />
      ))}
    </div>
  );
};

export default CartItems;
