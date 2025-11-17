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
  'Dosa': 'https://t3.ftcdn.net/jpg/05/05/40/28/360_F_505402811_prL7D5Go35LZKpQeUVEUiCLnO6spS3sk.jpg',
  'Idly': 'https://t3.ftcdn.net/jpg/01/61/13/52/360_F_161135273_7HHQHc40q0usaN2bDfnRzslUYBavkeOh.jpg',
  'Pongal': 'https://im.rediff.com/getahead/2024/mar/04food1.jpg',
  'Vada': 'https://i0.wp.com/homechefscooking.wordpress.com/wp-content/uploads/2018/03/aloo-methi-1.jpg?fit=1200%2C800&ssl=1',
  'Poori': 'https://img.freepik.com/premium-photo/suji-sooji-halwa-puri-sheera-shira-poori-breakfast-served-plate-bowl-selective-focus_466689-28955.jpg',
  'Chappathi': 'https://media.istockphoto.com/id/516359240/photo/bhendi-masala-or-bhindi-masala-ladies-finger-curry-with-chapati.jpg?s=612x612&w=0&k=20&c=0mGnvNM2lxl-dTTJlhAfVJE5WidxYmmvrvNs1NZUKvs=',
  'Parotta': 'https://as1.ftcdn.net/jpg/03/61/36/60/1000_F_361366017_02EkvHIMNVriHhpHK4SC4lGxXxbDfuzW.jpg',
  'Coffee': 'https://t4.ftcdn.net/jpg/01/05/90/77/360_F_105907729_4RzHYsHJ2UFt5koUI19fc6VzyFPEjeXe.jpg',
  'Milk': 'https://img.freepik.com/premium-photo/aesthetic-breakfast-milk-jug-pouring-milk-into-bowl-with-natural-muesli-made-from-mix-unprocessed-whole-grains_206268-3480.jpg',
  'Tea': 'https://media.istockphoto.com/id/1015308848/photo/process-brewing-tea-tea-ceremony-cup-of-freshly-brewed-fruit-and-herbal-tea-dark-mood-hot.jpg?s=612x612&w=0&k=20&c=tMG594LYE3nSE7sn3OuX77R9U64kwBLZl-Vv-bnj9xM=',
  'Veg Meals': 'https://t4.ftcdn.net/jpg/02/75/39/23/360_F_275392381_9upAWW5Rdsa4UE0CV6gRu2CwUETjzbKy.jpg',
  'Non-Veg Meals': 'https://t4.ftcdn.net/jpg/09/83/12/33/360_F_983123393_ECQHjoaSPbmS5xSTrmHHtAwZ9y3Pklmg.jpg',
  'Sambar Rice': 'https://t4.ftcdn.net/jpg/04/95/70/55/360_F_495705545_lNbZSN8a3XbmxvBecFoUOCwhjc9iJgr3.jpg',
  'Curd Rice': 'https://media.istockphoto.com/id/1168154867/photo/indian-curd-rice-with-carrots-pomegranate-and-with-additional-tempering-of-spices-close-up-in.jpg?s=612x612&w=0&k=20&c=r2OMqBs5H-VPjKj9n0SwTKYoC0XQ0-8jhQZB1YY8obU=',
  'Mutton Biriyani': 'https://media.istockphoto.com/id/469866881/photo/mutton-gosht-biryani.jpg?s=612x612&w=0&k=20&c=FH6dExVNp_hb9JtJCyGrmKAhPJwQo3UdlMC6gHCbVLg=',
  'Chicken Briyani': 'https://t4.ftcdn.net/jpg/05/81/48/89/360_F_581488930_jSWEv0Pd7fXqvV7llro7YCD3l0JfHdEA.jpg',
  'Fish Briyani': 'https://media.istockphoto.com/id/678078906/photo/fish-biryani-or-fish-rice-popular-indian-non-vegetarian-recipe-made-of-fish-marinated-with.jpg?s=612x612&w=0&k=20&c=FlkvIdLgUgz1-1mwj82uLEagU_6BTuDPECV5ynAdVVY=',
  'Mutton Curry': 'https://t4.ftcdn.net/jpg/15/04/09/19/360_F_1504091975_cIbyX8ih0Y1anGrhxho5dNwz6ipafLZq.jpg',
  'Tandoori': 'https://media.istockphoto.com/id/1396604313/photo/roasted-whole-chicken-legs-with-condiment-directly-above-photo.jpg?s=612x612&w=0&k=20&c=JDs72E-fX5SdcBQREta58T82W8zO_rFiKC7d1WwEEUE=',
  'Grilled Chicken': 'https://img.freepik.com/premium-photo/high-quality-grilling-chicken-meat-shashlik-metal-skewers_779468-1058.jpg',
  'Tava Fish Fry': 'https://jaffnadelivery.com/wp-content/uploads/2025/05/fish-fry.jpg',
  'Fried Rice': 'https://images.unsplash.com/photo-1604909052688-c8355f1d6bce?auto=format&fit=crop&w=1200&q=80',
  'Butter Chicken': 'https://t3.ftcdn.net/jpg/06/01/41/68/360_F_601416862_AfYdeefqT1kGqWTx1DZCsJZVzYIDFzPR.jpg',
  'Butter Naan': 'https://t3.ftcdn.net/jpg/08/95/50/04/360_F_895500474_IDUMxbOGEBn29tyPyjG8oLEEWlK8ZlOg.jpg',
  'Garlic Naan': 'https://t4.ftcdn.net/jpg/07/18/16/87/360_F_718168709_mc2zfZw46fQxI81ifoYBEWhJwpsL5iPY.jpg',
  'Mushroom Noodes': 'https://www.foodandwine.com/thmb/FioIZRbpiMXkonKRau8FwbcRjQs=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/201403-xl-mushroom-garlic-chicken-chow-mein-02ab4824b29d4bc293f987ad2a317a8f.jpg',
  'Pasta Alfredo': 'https://media.istockphoto.com/id/1451111530/photo/creamy-alfredo-pasta-with-chicken-mushrooms-and-parmesan-cheese-healthy-italian-food.jpg?s=612x612&w=0&k=20&c=MhHgRTw5-zoej97Hq__NbSfHFVtcvmsawZqpkky4Pwo=',
  'Grilled Salmon': 'https://bod-blog-assets.prod.cd.beachbodyondemand.com/bod-blog/wp-content/uploads/2021/08/How-to-Grill-Salmon.960.jpg',
  'Chicken Tikka': 'https://www.krumpli.co.uk/wp-content/uploads/2024/11/Chicken-Tikka-Kebab-Skewers-2-1600-720x405.jpg',
  'Lamb Chops': 'https://t4.ftcdn.net/jpg/06/60/22/27/360_F_660222789_dn7PRkd1BO5BiMI3NPWwNds289l23RFP.jpg',
  'Steaks': 'https://media.istockphoto.com/id/594465522/photo/grilling-steaks-on-flaming-grill-and-shot-with-selective-focus.jpg?s=612x612&w=0&k=20&c=HhFwjiElLxTo5-nQM_Vwh9knPZ_dVHGU0-L19RA1qYg=',
  'Palak Paneer': 'https://img.freepik.com/free-photo/flat-lay-pakistani-food-arrangement_23-2148825110.jpg',
  'Makhani Paneer': 'https://t4.ftcdn.net/jpg/08/24/35/87/360_F_824358712_32xGA30Y1XNegYq50MzFMGBJhyk04Pyv.jpg',
  'Pepsi': 'https://t4.ftcdn.net/jpg/02/84/65/61/360_F_284656175_G6SlGTBVl4pg8oXh6jr86cOmKUZjfrym.jpg',
  'Coke': 'https://t4.ftcdn.net/jpg/02/84/65/61/360_F_284656117_sPF8gVWaX627bq5qKrlrvCz1eFfowdBf.jpg',
  'Lemon Juice': 'https://t3.ftcdn.net/jpg/15/04/48/56/360_F_1504485618_OeOlOJVuPt0LAnXdDyPrJhdl9m0RlYgP.jpg',
  'Mosambi Juice': 'https://t4.ftcdn.net/jpg/11/02/97/81/360_F_1102978139_e5YXE4EtOZFqFcDxL6Dez1qFtzafhd8t.jpg',
  'Mint Juice': 'https://t4.ftcdn.net/jpg/01/51/87/63/360_F_151876341_AndmDKOm2W3RKQCrxUxnYgWx3hm0oG1p.jpg',

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
    name: 'mutton biriyani',
    price: 160,
    category: 'lunch',
    description: 'Aromatic spiced rice with vegetables or meat',
  }),
  withDefaults({
    id: '15',
    name: 'chicken biriyani',
    price: 160,
    category: 'lunch',
    description: 'Aromatic spiced rice with vegetables or meat',
  }),
  withDefaults({
    id: '16',
    name: 'fish biriyani',
    price: 160,
    category: 'lunch',
    description: 'Aromatic spiced rice with vegetables or meat',
  }),
  withDefaults({
    id: '17',
    name: 'Tandoori',
    price: 160,
    category: 'lunch',
    description: 'Aromatic spiced rice with vegetables or meat',
  }),
  withDefaults({
    id: '18',
    name: 'Grilled chicken',
    price: 160,
    category: 'lunch',
    description: 'Aromatic spiced rice with vegetables or meat',
  }),
  withDefaults({
    id: '19',
    name: 'Tava Fish Fry',
    price: 160,
    category: 'lunch',
    description: 'Aromatic spiced rice with vegetables or meat',
  }),
  // Dinner
  withDefaults({
    id: '20',
    name: 'Fried Rice',
    price: 130,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '21',
    name: 'Butter Chicken',
    price: 200,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '22',
    name: 'Butter Naan',
    price: 120,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '23',
    name: 'Garlic Naan',
    price: 100,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '24',
    name: 'Mushroom Noodles',
    price: 150,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '25',
    name: 'Pasta Alfredo',
    price: 120,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '26',
    name: 'Grilled Salmon',
    price: 280,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '27',
    name: 'Chicken Tikka',
    price: 240,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '28',
    name: 'Lamb Chops',
    price: 320,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '29',
    name: 'Steaks',
    price: 270,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '30',
    name: 'Palak Paneer',
    price: 140,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '31',
    name: 'Makhani Paneer',
    price: 150,
    category: 'dinner',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  // beverage
  withDefaults({
    id: '32',
    name: 'Pepsi',
    price: 80,
    category: 'beverage',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '33',
    name: 'Coke',
    price: 80,
    category: 'beverage',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '34',
    name: 'Lemon Juice',
    price: 50,
    category: 'beverage',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '35',
    name: 'Mosambi Juice',
    price: 60,
    category: 'beverage',
    description: 'Wok-tossed rice with veggies and spices',
  }),
  withDefaults({
    id: '36',
    name: 'Mint Juice',
    price: 50,
    category: 'beverage',
    description: 'Wok-tossed rice with veggies and spices',
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

