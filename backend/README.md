# ASH Tech ERP Backend

A comprehensive NestJS backend API for an Enterprise Resource Planning (ERP) system with JWT authentication, PostgreSQL database, and Prisma ORM.

## Features

- 🔐 **JWT Authentication & Authorization** - Role-based access control (Admin, Finance, Sales, Manager, Employee)
- 🗃️ **PostgreSQL Database** - Robust relational database with Prisma ORM
- 📊 **Complete ERP Modules** - Users, Customers, Products, Orders, Quotes, Invoices, Payments, Sales
- 🛡️ **Security** - Password hashing with bcrypt, input validation, CORS enabled
- 🚀 **Production Ready** - Global error handling, validation pipes, proper logging

## Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: class-validator & class-transformer
- **Password Hashing**: bcryptjs

## Quick Start

### Prerequisites

- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd erp-backend
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # Database
   DATABASE_URL="postgresql://postgres:usman123@localhost:5432/ASH_ERP_Project?schema=public"
   
   # JWT
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   JWT_EXPIRES_IN="24h"
   
   # Application
   PORT=3000
   NODE_ENV=development
   ```

3. **Set up PostgreSQL:**
   ```bash
   # Start PostgreSQL service
   sudo systemctl start postgresql
   
   # Set postgres user password
   sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'usman123';"
   
   # Create database
   sudo -u postgres createdb ASH_ERP_Project
   ```

4. **Run database migrations and seed:**
   ```bash
   # Generate Prisma client and push schema
   npx prisma generate
   npx prisma db push
   
   # Seed database with sample data
   npm run db:seed
   ```

5. **Start the server:**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run build
   npm run start:prod
   ```

The API will be available at `http://localhost:3000/api`

## Default Accounts

After running the seed script, you can use these accounts:

- **Admin**: `admin@ashtech.com` / `admin123`
- **Finance**: `finance@ashtech.com` / `finance123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `POST /api/auth/register` - Register new user (Admin only)

### Users Management
- `GET /api/users` - List all users (Admin/Manager)
- `GET /api/users/:id` - Get user by ID (Admin/Manager)
- `POST /api/users` - Create new user (Admin)
- `PATCH /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Soft delete user (Admin)

### Customers Management
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get customer by ID
- `POST /api/customers` - Create new customer (Admin/Sales/Manager)
- `PATCH /api/customers/:id` - Update customer (Admin/Sales/Manager)
- `DELETE /api/customers/:id` - Soft delete customer (Admin/Manager)

### Products Management
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/sku/:sku` - Get product by SKU
- `GET /api/products/low-stock` - Get low stock products (Admin/Manager)
- `POST /api/products` - Create new product (Admin/Manager)
- `PATCH /api/products/:id` - Update product (Admin/Manager)
- `PATCH /api/products/:id/stock` - Update product stock (Admin/Manager)
- `DELETE /api/products/:id` - Soft delete product (Admin/Manager)

## Database Schema

The system includes the following main entities:

- **Users** - System users with role-based access
- **Companies** - Business entities
- **Customers** - Customer information and relationships
- **Products** - Product catalog with inventory management
- **Orders** - Sales orders with line items
- **Quotes** - Price quotations
- **Invoices** - Billing documents with payment tracking
- **Payments** - Payment records
- **Sales** - Direct sales transactions

## Authentication & Authorization

### JWT Token Format
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234567890
}
```

### User Roles
- **ADMIN** - Full system access
- **FINANCE** - Financial operations access
- **SALES** - Sales and customer management
- **MANAGER** - Management level access
- **EMPLOYEE** - Basic access

### Usage Example
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ashtech.com","password":"admin123"}'

# Use the returned token
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Development

### Available Scripts
- `npm run start` - Start production server
- `npm run start:dev` - Start development server with hot reload
- `npm run start:debug` - Start server in debug mode
- `npm run build` - Build for production
- `npm run db:seed` - Seed database with sample data

### Database Operations
```bash
# Reset database
npx prisma db push --force-reset

# View database in Prisma Studio
npx prisma studio

# Generate new migration
npx prisma migrate dev --name your_migration_name
```

## Production Deployment

1. **Environment Setup:**
   - Set `NODE_ENV=production`
   - Use strong `JWT_SECRET`
   - Configure production database URL
   - Set up proper CORS origins

2. **Build and Deploy:**
   ```bash
   npm run build
   npm run start:prod
   ```

3. **Database Setup:**
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```

## Security Considerations

- JWT tokens expire in 24 hours by default
- Passwords are hashed using bcrypt with salt rounds of 12
- Input validation on all endpoints
- Role-based authorization guards
- CORS configured for cross-origin requests
- Soft deletes for data integrity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team at ASH Tech Solutions.

