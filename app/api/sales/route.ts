import { NextRequest, NextResponse } from 'next/server';
import { getOrders } from '@/lib/data';
import { SalesReport } from '@/lib/types';
import { format, parseISO } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    
    if (!month) {
      return NextResponse.json({ error: 'Month parameter is required (YYYY-MM)' }, { status: 400 });
    }
    
    const orders = await getOrders();
    const filtered = orders.filter(order => {
      const orderDate = parseISO(order.date);
      const orderMonth = format(orderDate, 'yyyy-MM');
      return orderMonth === month;
    });
    
    const report: SalesReport = {
      month,
      totalSales: 0,
      totalOrders: filtered.length,
      items: [],
    };
    
    const itemMap = new Map<string, { quantity: number; revenue: number }>();
    
    filtered.forEach(order => {
      report.totalSales += order.total;
      order.items.forEach(item => {
        const existing = itemMap.get(item.name) || { quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.price * item.quantity;
        itemMap.set(item.name, existing);
      });
    });
    
    report.items = Array.from(itemMap.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));
    
    return NextResponse.json(report);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate sales report' }, { status: 500 });
  }
}

