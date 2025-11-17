import { NextRequest, NextResponse } from 'next/server';
import { getOrders, saveOrder, getMenuItems, saveMenuItems } from '@/lib/data';
import { Order, MenuItem } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    const orders = await getOrders();
    
    if (month) {
      const filtered = orders.filter(order => {
        const orderDate = new Date(order.date);
        const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
        return orderMonth === month;
      });
      return NextResponse.json(filtered);
    }
    
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const order: Order = await request.json();
    order.id = order.id || Date.now().toString();
    order.date = order.date || new Date().toISOString();

    // Decrement inventory based on ordered items
    const items = await getMenuItems();
    const itemsById = new Map(items.map((i) => [i.id, i]));

    // Validate stock
    for (const ci of order.items) {
      const stored = itemsById.get(ci.id);
      if (!stored) {
        return NextResponse.json({ error: `Item not found: ${ci.name}` }, { status: 400 });
      }
      const currentStock = stored.stock ?? 0;
      if (currentStock < ci.quantity) {
        return NextResponse.json({ error: `Insufficient stock for ${stored.name}. Available: ${currentStock}` }, { status: 400 });
      }
    }

    // Apply stock decrement
    const updated: MenuItem[] = items.map((it) => {
      const ordered = order.items.find((ci) => ci.id === it.id);
      if (!ordered) return it;
      const currentStock = it.stock ?? 0;
      return { ...it, stock: Math.max(0, currentStock - ordered.quantity) };
    });

    await saveMenuItems(updated);
    await saveOrder(order);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

