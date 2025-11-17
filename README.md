# Restaurant-POS

A modern restaurant POS (Point of Sale) for menu, billing, and reports built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Menu Management (CRUD)**
  - Add, edit, and delete menu items
  - Upload images for menu items
  - Organize items by category (breakfast, beverage)

- **Customer Menu Display**
  - Beautiful card-based menu layout
  - Click items to add to cart
  - Real-time cart updates

- **Billing System**
  - Add items to cart by clicking
  - Update quantities
  - Calculate subtotal, GST (18%), and total
  - Clear cart functionality
  - Print bill
  - Pay Now with QR code generation

- **Sales Reports**
  - Monthly sales reports
  - Item-wise sales breakdown
  - Total orders and revenue tracking
  - Print reports

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - React components (Cart, MenuItemCard)
- `/lib` - Utility functions and data management
- `/data` - JSON files for menu items and orders (created automatically)

## Usage

### Customer View
- Browse menu items
- Click items to add to cart
- View cart and adjust quantities
- Print bill or pay via QR code
- Complete order

### Admin Panel
- Navigate to `/admin` to manage menu items
- Add, edit, or delete items
- Upload images for items
- View sales reports at `/admin/reports`

## Default Menu Items

The system comes with pre-loaded breakfast items:
- Dosa, Idly, Pongal, Vada, Poori, Chappathi, Parotta
- Coffee, Milk, Tea

## Technologies Used

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- QRCode.react for QR code generation
- date-fns for date handling

