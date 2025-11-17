'use client';

import { useState, useEffect } from 'react';
import { MenuItem, CartItem } from '@/lib/types';
import MenuItemCard from '@/components/MenuItemCard';
import Cart from '@/components/Cart';

export default function Home() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('all');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Failed to fetch menu items:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item: MenuItem) => {
    if ((item.stock ?? 0) <= 0) {
      alert(`${item.name} is out of stock`);
      return;
    }
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        const currentQty = existing.quantity;
        const available = item.stock ?? 0;
        if (currentQty + 1 > available) {
          alert(`Only ${available} left in stock for ${item.name}`);
          return prev;
        }
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = async () => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gst = total * 0.18;
    const finalTotal = total + gst;

    const order = {
      id: Date.now().toString(),
      items: cartItems,
      total: finalTotal,
      date: new Date().toISOString(),
    };

    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });
      alert('Order placed successfully!');
      clearCart();
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  const categories = ['all', 'breakfast', 'lunch', 'dinner', 'beverage'];
  const filteredItems =
    category === 'all'
      ? menuItems
      : menuItems.filter((i) => i.category === category);

  return (
    <div className="min-h-screen bg-red-500">
      <header className="bg-stone-950 shadow-md fixed z-10 w-full">
        <div className="container mx-auto px-1.5 py-1">
          <div className="flex justify-between items-center">
            {/* <h1 className="text-3xl font-bold text-gray-800">Restaurant Menu</h1> */}
            <img className="w-24 h-20 object-contain" src='https://img.freepik.com/premium-vector/retro-restaurant-logo_23-2148474404.jpg' />
            <a
              href="/admin"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-gray-700"
            >
              Manage Menu
            </a>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-white font-bold">
                {category === 'all'
                  ? 'All Items'
                  : `${category.charAt(0).toUpperCase()}${category.slice(1)} Menu`}
              </h2>
              <div className="flex gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1 rounded border ${
                      category === c
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onAddToCart={addToCart} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Cart
              items={cartItems}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={handleCheckout}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

