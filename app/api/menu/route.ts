import { NextRequest, NextResponse } from 'next/server';
import { getMenuItems, saveMenuItems } from '@/lib/data';
import { MenuItem } from '@/lib/types';

export async function GET() {
  try {
    const items = await getMenuItems();
    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const item: MenuItem = await request.json();
    const items = await getMenuItems();
    
    // Generate ID if not provided
    if (!item.id) {
      item.id = Date.now().toString();
    }
    
    items.push(item);
    await saveMenuItems(items);
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const item: MenuItem = await request.json();
    const items = await getMenuItems();
    const index = items.findIndex(i => i.id === item.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    
    items[index] = item;
    await saveMenuItems(items);
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }
    
    const items = await getMenuItems();
    const filtered = items.filter(i => i.id !== id);
    await saveMenuItems(filtered);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}

