# Sole Haven - Premium Shoe E-Commerce Platform

A modern, full-stack e-commerce application built with React, Express, and PostgreSQL. Sole Haven offers a seamless shopping experience with a beautiful UI, secure payment processing, and comprehensive product management.

![Sole Haven](client/public/assets/hero.png)

## 🌟 Features

- **Product Catalog** - Browse and filter premium shoes with detailed product information
- **User Authentication** - Secure login/signup system with session management
- **Shopping Cart** - Add/remove products and manage quantities
- **Favorites/Wishlist** - Save favorite products for later
- **Product Details** - High-quality images, descriptions, ratings, and reviews
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Admin Features** - Product management and order tracking (coming soon)
- **Secure Payments** - Integrated payment processing
- **Order Management** - Track orders and delivery status

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Wouter** - Lightweight routing
- **React Query** - Data fetching & caching
- **Radix UI** - Accessible components
- **Lucide React** - Icons

### Backend
- **Express** - Node.js framework
- **PostgreSQL** - Database
- **Drizzle ORM** - Type-safe ORM
- **TypeScript** - Type safety

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

## 📁 Project Structure

```
Sole-Haven/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   ├── lib/           # Utilities
│   │   └── App.tsx        # Root component
│   ├── public/
│   │   └── assets/        # Images & static files
│   └── index.html
├── server/                # Express backend
│   ├── index.ts          # Server entry point
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   ├── auth.ts           # Authentication logic
│   └── storage.ts        # Database operations
├── shared/               # Shared types & schemas
│   ├── schema.ts         # Database schema
│   └── routes.ts         # Route definitions
├── docker-compose.yml    # Production compose config
├── docker-compose.dev.yml # Development compose config
├── Dockerfile            # Container image
└── package.json          # Dependencies
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20+
- **Docker** & **Docker Compose** (optional, for containerized setup)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Sole-Haven
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/sole_haven
```

### Development

#### Option 1: With Docker (Recommended)

Start the PostgreSQL database container:
```bash
docker-compose -f docker-compose.dev.yml up -d
```

Wait 10 seconds for the database to initialize, then run:
```bash
npm run dev
```

#### Option 2: Local PostgreSQL

Ensure PostgreSQL is running locally, then:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

**Features in development mode:**
- Hot module reloading (HMR) for instant updates
- Source maps for debugging
- Database logging

### Production Build

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

Or use Docker Compose for production:
```bash
docker-compose up --build
```

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run check` | Run TypeScript type checking |
| `npm run db:push` | Push database schema changes |

## 🐳 Docker Setup

### Development

```bash
docker-compose -f docker-compose.dev.yml up -d      # Start containers
docker-compose -f docker-compose.dev.yml down -v    # Stop & remove volumes
docker-compose -f docker-compose.dev.yml logs -f    # View logs
```

### Production

```bash
docker-compose up --build                    # Build & start
docker-compose down                          # Stop containers
docker-compose down -v                       # Stop & remove volumes
```

**Environment Configuration:**
- Development: `localhost:5432` for database
- Production: `postgres:5432` (Docker internal network)

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products?sort=newest` - Get new arrivals
- `GET /api/products/:id` - Get product details

### Cart
- `POST /api/cart/add` - Add to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/:id` - Remove from cart

### Favorites
- `GET /api/favorites` - Get favorite products
- `POST /api/favorites/:id` - Add to favorites
- `DELETE /api/favorites/:id` - Remove from favorites

### Authentication
- `POST /api/auth/signup` - Register new account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

## 🗄️ Database

The application uses PostgreSQL with Drizzle ORM for type-safe database operations.

### Schema
Located in `shared/schema.ts`:
- Users
- Products
- Orders
- Cart Items
- Favorites

### Migrations
```bash
npm run db:push              # Apply pending migrations
```

Migrations are stored in `migrations/` directory.

## 🎨 Styling

The project uses **Tailwind CSS** for styling with:
- Custom theme colors
- Responsive design utilities
- Dark mode support (configurable)

## 🔐 Security Features

- ✅ HTTPS/TLS ready
- ✅ Password encryption
- ✅ Session management
- ✅ CORS configured
- ✅ Input validation
- ✅ SQL injection prevention (Drizzle ORM)
- ✅ XSS protection

## 📦 Deployment

### Docker Hub
```bash
docker build -t sole-haven:latest .
docker tag sole-haven:latest your-username/sole-haven:latest
docker push your-username/sole-haven:latest
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@db-host:5432/sole_haven
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Verify database is running
docker-compose -f docker-compose.dev.yml ps

# View database logs
docker-compose -f docker-compose.dev.yml logs postgres

# Reset database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9          # macOS/Linux
netstat -ano | findstr :5000            # Windows
```

### Dotenv Not Loading
Make sure `.env` file is in the root directory and `dotenv/config` is imported at the top of `server/index.ts`.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

Created as a modern e-commerce platform showcase.

## 🚀 Future Features

- [ ] Admin dashboard
- [ ] Product reviews & ratings
- [ ] Inventory management
- [ ] Email notifications
- [ ] Multi-currency support
- [ ] Advanced analytics
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations

---

**Last Updated:** April 2026

For questions or support, please open an issue on GitHub.
