# Pet Supply Inventory Management System with Real-time Chat

A modern, interactive inventory management system for pet supply stores featuring a real-time chat interface for querying products, checking stock levels, and receiving alerts.

## Features

### Chat Interface
- **Real-time messaging system** for inventory queries
- **Natural language processing** for product searches
- **Automated responses** with product information
- **Stock level checking** via chat commands
- **Low stock alerts** displayed in chat
- **Command system** for quick actions

### Inventory Management
- **Real-time inventory overview** with statistics
- **Product categorization** (food, toys, accessories, healthcare, grooming)
- **Stock level monitoring** with visual indicators
- **Filtering system** (all products, low stock, out of stock)
- **Sorting options** (by name, stock level, category)
- **Total inventory value calculation**

### Stock Alerts
- Automatic detection of low stock items
- Out-of-stock notifications
- Visual indicators (color-coded status)
- Alert severity levels (low, critical, out)

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns
- **UUID Generation**: uuid
- **Real-time**: Ready for Socket.io integration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone or navigate to the project directory:
```bash
cd pet-supply-inventory-chat
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Chat Commands

The chat interface supports natural language queries and specific commands:

### Product Search
- `search [product name]` - Search for specific products
- `find dog food` - Find products matching keywords

### Stock Checking
- `stock [product name]` - Check stock levels for specific products
- `inventory cat litter` - View inventory details

### Alerts
- `low stock` - View all products with low stock
- `alert` - Show current stock alerts

### General
- `list all` - Show all products in inventory
- `help` - Display available commands
- `commands` - Show command list

### Example Queries

```
search dog food
stock flea treatment
low stock
list all
help
```

## Project Structure

```
pet-supply-inventory-chat/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page with chat and inventory
├── components/
│   ├── ChatInterface.tsx     # Chat component with message handling
│   └── InventoryPanel.tsx    # Inventory overview panel
├── lib/
│   └── mockData.ts           # Sample product data
├── types/
│   └── index.ts              # TypeScript type definitions
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS configuration
└── README.md                 # This file
```

## Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  category: 'food' | 'toys' | 'accessories' | 'healthcare' | 'grooming' | 'other';
  stock: number;
  minStock: number;
  price: number;
  supplier?: string;
  lastUpdated: Date;
}
```

### Chat Message
```typescript
interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system' | 'alert' | 'query';
  productQuery?: ProductQuery;
}
```

### Stock Alert
```typescript
interface StockAlert {
  id: string;
  product: Product;
  message: string;
  severity: 'low' | 'critical' | 'out';
  timestamp: Date;
  acknowledged: boolean;
}
```

## Features in Detail

### Chat Interface (`ChatInterface.tsx`)
- Real-time message display with auto-scroll
- Message type differentiation (user, system, alert, query)
- Natural language processing for commands
- Product search with fuzzy matching
- Stock level queries with detailed responses
- Low stock alert generation
- Help system with command list
- Keyboard shortcuts (Enter to send)

### Inventory Panel (`InventoryPanel.tsx`)
- Product statistics overview
- Total inventory value calculation
- Low stock and out-of-stock counters
- Filtering by stock status
- Sorting by multiple criteria
- Visual stock level indicators
- Color-coded status badges
- Progress bars for stock levels
- Detailed product information cards

## Sample Products

The system comes with 10 sample products including:
- Premium Dog Food
- Cat Litter Box
- Squeaky Dog Toy Set
- Flea & Tick Treatment
- Cat Food - Salmon Flavor
- Pet Grooming Brush (out of stock example)
- Retractable Dog Leash
- Bird Seed Mix
- Aquarium Water Conditioner
- Rabbit Hutch Bedding

## Future Enhancements

- [ ] Real Socket.io integration for multi-user chat
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User authentication and roles
- [ ] Product CRUD operations
- [ ] Order management system
- [ ] Supplier management
- [ ] Advanced reporting and analytics
- [ ] Mobile responsive improvements
- [ ] Export functionality (CSV, PDF)
- [ ] Email notifications for critical alerts
- [ ] Barcode scanner integration
- [ ] Multi-location inventory tracking

## Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a demo project. Feel free to fork and modify for your needs.

## License

MIT License - feel free to use this project for commercial or personal purposes.

## Support

For issues or questions, please create an issue in the project repository.

---

Built with Next.js, TypeScript, and Tailwind CSS
