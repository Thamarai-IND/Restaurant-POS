'use client';

import { CartItem } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, onClearCart, onCheckout }: CartProps) {
  const [showQR, setShowQR] = useState(false);
  const [showBill, setShowBill] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = total * 0.18; // 18% GST
  const finalTotal = total + gst;

  const handlePrint = () => {
    setShowBill(true);
    setTimeout(() => {
      const printContent = document.getElementById('print-bill');
      if (printContent) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Restaurant Bill</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  h2 { text-align: center; }
                  .item-row { display: flex; justify-content: space-between; margin: 5px 0; }
                  .total-row { border-top: 2px solid black; padding-top: 10px; margin-top: 10px; }
                </style>
              </head>
              <body>
                ${printContent.innerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
          setShowBill(false);
        }
      }
    }, 100);
  };

  const handlePayNow = () => {
    setShowQR(true);
  };

  const generatePaymentData = () => {
    return JSON.stringify({
      amount: finalTotal.toFixed(2),
      items: items.map(item => ({ name: item.name, quantity: item.quantity, price: item.price })),
      timestamp: new Date().toISOString(),
    });
  };

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Cart</h2>
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Cart</h2>
          <button
            onClick={onClearCart}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Cart
          </button>
        </div>

        <div className="space-y-3 mb-4 max-h-96 overflow-y-auto">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500">₹{item.price} each</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300"
                >
                  +
                </button>
                <span className="w-20 text-right font-semibold">
                  ₹{item.price * item.quantity}
                </span>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>GST (18%):</span>
            <span>₹{gst.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold border-t pt-2">
            <span>Total:</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <button
            onClick={handlePayNow}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
          >
            Pay Now
          </button>
          <button
            onClick={handlePrint}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold"
          >
            Print Bill
          </button>
          <button
            onClick={onCheckout}
            className="w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-semibold"
          >
            Complete Order
          </button>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-center">Scan to Pay</h3>
            <div className="flex justify-center mb-4">
              <QRCodeSVG value={generatePaymentData()} size={256} />
            </div>
            <p className="text-center text-gray-600 mb-4">Amount: ₹{finalTotal.toFixed(2)}</p>
            <button
              onClick={() => setShowQR(false)}
              className="w-full px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showBill && (
        <div id="print-bill" style={{ display: 'none' }}>
          <div className="max-w-md mx-auto p-8">
            <h2 className="text-3xl font-bold text-center mb-4">RESTAURANT BILL</h2>
            <div className="border-b-2 border-black mb-4"></div>
            <p className="text-center mb-4">Date: {new Date().toLocaleString()}</p>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x{item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-black pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t-2 border-black pt-2">
                <span>Total:</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
            <p className="text-center mt-8">Thank you for your visit!</p>
          </div>
        </div>
      )}
    </>
  );
}

