import { promises as fs } from 'fs';
import path from 'path';
import { MenuItem, Order } from './types';

const dataDir = path.join(process.cwd(), 'data');
const menuFile = path.join(dataDir, 'menu.json');
const ordersFile = path.join(dataDir, 'orders.json');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

const itemImages: Record<string, string> = {
  dosa: 'https://cdn.pixabay.com/photo/2017/04/04/18/27/masala-dosa-2204726_1280.jpg',
  idly: 'https://cdn.pixabay.com/photo/2019/04/06/15/36/idli-4108188_1280.jpg',
  pongal: 'https://cdn.pixabay.com/photo/2020/01/18/12/24/ven-pongal-4774989_1280.jpg',
  vada: 'https://cdn.pixabay.com/photo/2018/10/07/22/01/medu-vada-3733490_1280.jpg',
  poori: 'https://cdn.pixabay.com/photo/2019/03/31/05/24/poori-4093034_1280.jpg',
  chappathi: 'https://cdn.pixabay.com/photo/2018/03/08/20/09/chapati-3200202_1280.jpg',
  parotta: 'https://cdn.pixabay.com/photo/2020/01/22/14/51/parotta-4785866_1280.jpg',
  coffee: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80',
  milk: 'https://images.unsplash.com/photo-1589463397556-4c5d1110b539?auto=format&fit=crop&w=800&q=80',
  tea: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
  meals: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
  thali: 'https://images.unsplash.com/photo-1625944524164-4bd2a8e6ce07?auto=format&fit=crop&w=1000&q=80',
  'sambar rice': 'https://images.unsplash.com/photo-1590502593747-42a08d0216fe?auto=format&fit=crop&w=1000&q=80',
  'curd rice': 'https://images.unsplash.com/photo-1651044457571-4698f249da86?auto=format&fit=crop&w=1000&q=80',
  biriyani: 'https://images.unsplash.com/photo-1604909052688-c8355f1d6bce?auto=format&fit=crop&w=1200&q=80',
  'fried rice': 'https://images.unsplash.com/photo-1604909052688-c8355f1d6bce?auto=format&fit=crop&w=1200&q=80',
  noodles: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
  'paneer butter masala': 'https://images.unsplash.com/photo-1625944524164-4bd2a8e6ce07?auto=format&fit=crop&w=1200&q=80',
  'chicken curry': 'https://images.unsplash.com/photo-1625944524164-4bd2a8e6ce07?auto=format&fit=crop&w=1200&q=80',
  'fish fry': 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80',
};

const withDefaults = (item: MenuItem): MenuItem => {
  const key = item.name.trim().toLowerCase();
  if (item.image && item.image.length > 0) {
    // keep
  }

  const image = itemImages[key];
  const withImage = image ? { ...item, image } : { ...item };
  // Default stock values if missing
  if (withImage.stock === undefined) withImage.stock = 50;
  if (withImage.lowStockThreshold === undefined) withImage.lowStockThreshold = 10;
  return withImage;
};

// Initialize default menu items
const defaultMenuItems: MenuItem[] = [
  withDefaults({
    id: '1',
    name: 'Dosa',
    price: 50,
    category: 'breakfast',
    description: 'Crispy South Indian crepe',
  }),
  withDefaults({
    id: '2',
    name: 'Idly',
    price: 40,
    category: 'breakfast',
    description: 'Steamed rice cakes',
  }),
  withDefaults({
    id: '3',
    name: 'Pongal',
    price: 45,
    category: 'breakfast',
    description: 'Savory rice and lentil dish',
  }),
  withDefaults({
    id: '4',
    name: 'Vada',
    price: 35,
    category: 'breakfast',
    description: 'Fried lentil donut',
  }),
  withDefaults({
    id: '5',
    name: 'Poori',
    price: 40,
    category: 'breakfast',
    description: 'Deep-fried bread',
  }),
  withDefaults({
    id: '6',
    name: 'Chappathi',
    price: 30,
    category: 'breakfast',
    description: 'Whole wheat flatbread',
  }),
  withDefaults({
    id: '7',
    name: 'Parotta',
    price: 35,
    category: 'breakfast',
    description: 'Layered flatbread',
  }),
  withDefaults({
    id: '8',
    name: 'Coffee',
    price: 25,
    category: 'beverage',
    description: 'Hot filter coffee',
  }),
  withDefaults({
    id: '9',
    name: 'Milk',
    price: 20,
    category: 'beverage',
    description: 'Fresh milk',
  }),
  withDefaults({
    id: '10',
    name: 'Tea',
    price: 20,
    category: 'beverage',
    description: 'Hot tea',
  }),
  // Lunch
  withDefaults({
    id: '11',
    name: 'Meals',
    price: 120,
    category: 'lunch',
    description: 'South Indian meals (rice, sambar, rasam, poriyal, curd)',
  }),
  withDefaults({
    id: '12',
    name: 'Sambar Rice',
    price: 90,
    category: 'lunch',
    description: 'Rice served with flavorful sambar',
  }),
  withDefaults({
    id: '13',
    name: 'Curd Rice',
    price: 80,
    category: 'lunch',
    description: 'Comforting rice mixed with curd and tempering',
  }),
  withDefaults({
    id: '14',
    name: 'Biriyani',
    price: 160,
    category: 'lunch',
    description: 'Aromatic spiced rice with vegetables or meat',
  }),
  // Dinner
  withDefaults({
    id: '15',
    name: 'Fried Rice',
    price: 130,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '16',
    name: 'Noodles',
    price: 130,
    category: 'dinner',
    description: 'Stir-fried noodles with vegetables',
  }),
  withDefaults({
    id: '17',
    name: 'Paneer Butter Masala',
    price: 170,
    category: 'dinner',
    description: 'Creamy tomato gravy with paneer',
  }),
  withDefaults({
    id: '18',
    name: 'Chicken Curry',
    price: 200,
    category: 'dinner',
    description: 'Spicy and flavorful chicken curry',
  }),
  withDefaults({
    id: '19',
    name: 'Fish Fry',
    price: 180,
    category: 'dinner',
    description: 'Crispy and spicy fried fish',
  }),
];

export async function getMenuItems(): Promise<MenuItem[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(menuFile, 'utf-8');
    const items: MenuItem[] = JSON.parse(data);
    const existingByName = new Map(
      items.map((i) => [i.name.trim().toLowerCase(), i]),
    );
    const merged: MenuItem[] = [...items];
    // Add any missing default items (by name)
    defaultMenuItems.forEach((def) => {
      const key = def.name.trim().toLowerCase();
      if (!existingByName.has(key)) {
        merged.push(def);
      }
    });
    const enrichedItems = merged.map(withDefaults);

    const hasChanges =
      enrichedItems.length !== items.length ||
      enrichedItems.some((it, idx) => JSON.stringify(it) !== JSON.stringify(items[idx]));

    if (hasChanges) await saveMenuItems(enrichedItems);

    return enrichedItems;
  } catch {
    // If file doesn't exist, create it with default items
    await fs.writeFile(menuFile, JSON.stringify(defaultMenuItems, null, 2));
    return defaultMenuItems;
  }
}

export async function saveMenuItems(items: MenuItem[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(menuFile, JSON.stringify(items, null, 2));
}

export async function getOrders(): Promise<Order[]> {
  await ensureDataDir();
  try {
    const data = await fs.readFile(ordersFile, 'utf-8');
    return JSON.parse(data);
  } catch {
    await fs.writeFile(ordersFile, JSON.stringify([], null, 2));
    return [];
  }
}

export async function saveOrder(order: Order): Promise<void> {
  await ensureDataDir();
  const orders = await getOrders();
  orders.push(order);
  await fs.writeFile(ordersFile, JSON.stringify(orders, null, 2));
}

