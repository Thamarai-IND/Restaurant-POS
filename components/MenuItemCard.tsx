'use client';

import { MenuItem } from '@/lib/types';
import Image from 'next/image';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: MenuItem) => void;
}

export default function MenuItemCard({ item, onAddToCart }: MenuItemCardProps) {
  return (
    <div
      onClick={() => onAddToCart(item)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow transform hover:scale-105"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center relative overflow-hidden">
        {item.image ? (
          item.image.startsWith('data:') ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          )
        ) : (
          <span className="text-6xl">🍽️</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold mb-1">{item.name}</h3>
        {/* {item.description && (
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        )} */}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">₹{item.price}</span>
          <div className="flex items-center gap-3">
            {/* <span className={`text-sm ${((item.stock ?? 0) <= (item.lowStockThreshold ?? 0)) ? 'text-red-600' : 'text-gray-600'}`}>
              Stock: {item.stock ?? 0}
            </span> */}
            <button
              disabled={(item.stock ?? 0) <= 0}
              className={`px-4 py-2 rounded text-white ${((item.stock ?? 0) <= 0) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

