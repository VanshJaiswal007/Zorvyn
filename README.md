# Finance Backend API

A complete backend system for a finance dashboard with role-based access control, financial record management, and analytics APIs. Built with **Node.js**, **Express**, **MongoDB**, **JWT**, and **Swagger** documentation.

## 🎯 Project Overview

This is a **backend-only assignment** designed for an internship position. It provides:

- **User & Role Management**: Admin, Analyst, and Viewer roles with granular permissions
- **Financial Record CRUD**: Create, read, update, and delete financial transactions
- **Dashboard Analytics**: Summary endpoints for income, expenses, trends, and analytics
- **Role-Based Access Control**: Middleware-enforced permission checks
- **JWT Authentication**: Secure token-based authentication
- **Data Persistence**: MongoDB for reliable data storage
- **API Documentation**: Swagger/OpenAPI at `/api-docs`
- **Security**: Helmet, CORS, rate limiting, password hashing

## 📋 Requirements Met

✅ User and role management with status (active/inactive)  
✅ Financial records CRUD with filtering, pagination, and sorting  
✅ Dashboard summary and analytics APIs  
✅ Role-based access control enforced at middleware level  
✅ Validation and error handling  
✅ Data persistence with MongoDB  
✅ API documentation with Swagger  
✅ Seed script with demo users and sample data  
✅ Clean, modular project structure  
✅ Production-ready code with security best practices  

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Server**: Express.js v4.18
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod
- **Password Security**: bcryptjs
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Morgan
- **API Docs**: Swagger UI
- **Development**: Nodemon

## 📁 Project Structure

```
finance-backend/
├── src/
│   ├── models/              # Mongoose schemas
│   │   ├── User.js
│   │   ├── Role.js
│   │   ├── FinancialRecord.js
│   │   └── AuditLog.js
│   ├── controllers/         # Route handlers with business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── recordController.js
│   │   └── dashboardController.js
│   ├── services/            # Database operations and aggregations
│   │   ├── userService.js
│   │   ├── recordService.js
│   │   └── dashboardService.js
│   ├── routes/              # API route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── recordRoutes.js
│   │   └── dashboardRoutes.js
│   ├── middlewares/         # Auth, validation, error handling
│   │   ├── auth.js          # JWT protection and authorization
│   │   ├── validation.js    # Request validation
│   │   └── errorHandler.js  # Global error handler
│   ├── validators/          # Zod validation schemas
│   │   ├── authValidator.js
│   │   └── recordValidator.js
│   ├── utils/               # Helper functions
│   │   ├── jwt.js           # JWT utilities
│   │   └── errors.js        # Custom error class
│   ├── config/
│   │   └── database.js      # MongoDB connection
│   ├── seeds/
│   │   └── seed.js          # Database seed with demo data
│   ├── app.js               # Express app setup
│   └── swagger.js           # Swagger documentation config
├── server.js                # Application entry point
├── package.json
├── .env.example             # Environment variables template
└── README.md                # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js v14+ installed
- MongoDB running locally or Atlas connection string
- npm or yarn package manager

### Installation

1. **Clone or extract the project**
   ```bash
   cd finance-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env with your settings
   ```

4. **Seed the database** (creates demo users and sample data)
   ```bash
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Or production mode
   npm start
   ```

6. **Access the API**
   - API Base: `http://localhost:5000/api`
   - Documentation: `http://localhost:5000/api-docs`
   - Health Check: `http://localhost:5000/health`

## 📚 API Endpoints

### Authentication

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login and get JWT token
GET    /api/auth/me            - Get current user (protected)
POST   /api/auth/logout        - Logout (protected)
```

### Users (Admin Only)

```
GET    /api/users              - List all users with pagination
POST   /api/users              - Create new user
GET    /api/users/:id          - Get user details
PATCH  /api/users/:id          - Update user info
PATCH  /api/users/:id/role     - Assign role to user
PATCH  /api/users/:id/status   - Activate/deactivate user
DELETE /api/users/:id          - Delete user
```

### Financial Records

```
POST   /api/records            - Create record (Analyst, Admin)
GET    /api/records            - List records with filters (All users)
GET    /api/records/:id        - Get record details
PATCH  /api/records/:id        - Update record (Analyst, Admin)
DELETE /api/records/:id        - Delete record (Analyst, Admin)
```

### Dashboard & Analytics

```
GET    /api/dashboard/summary           - Total income, expenses, balance
GET    /api/dashboard/category-summary  - Breakdown by category
GET    /api/dashboard/type-summary      - Income vs Expense summary
GET    /api/dashboard/monthly-trends    - 12-month trend data
GET    /api/dashboard/weekly-trends     - 12-week trend data
GET    /api/dashboard/recent-activity   - Latest transactions
```

## 🔐 Authentication & Authorization

### JWT Token

- Tokens obtained via `/api/auth/login` and `/api/auth/register`
- Include in requests: `Authorization: Bearer <token>`
- Token expires in 7 days (configurable via `JWT_EXPIRY`)

### Role-Based Access Control

#### Viewer Role
- ✅ View own records
- ✅ View dashboard summaries (own data only)
- ❌ Cannot create/update/delete records
- ❌ Cannot manage users

#### Analyst Role
- ✅ Create financial records
- ✅ Update/delete own records
- ✅ View all dashboard data
- ❌ Cannot manage users

#### Admin Role
- ✅ Full access to all resources
- ✅ User management
- ✅ Record management
- ✅ Dashboard access

### Status-Based Access

- **Active Users**: Can access all authenticated routes
- **Inactive Users**: Blocked from accessing protected routes

## 🧪 Testing the API

### Demo Credentials (After Running Seed)

```
Admin User:
  Email: admin@finance.com
  Password: password123

Analyst User:
  Email: analyst@finance.com
  Password: password123

Viewer User:
  Email: viewer@finance.com
  Password: password123
```

### Example API Requests

**1. Login and Get Token**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analyst@finance.com",
    "password": "password123"
  }'
```

**2. Create Financial Record**
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer <YOUR_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "type": "income",
    "category": "Salary",
    "date": "2024-03-15T10:00:00Z",
    "description": "Monthly salary",
    "notes": "March payment"
  }'
```

**3. Get Dashboard Summary**
```bash
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

**4. Filter Records**
```bash
curl -X GET 'http://localhost:5000/api/records?type=expense&category=Food&page=1&limit=10' \
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

## 🎛️ Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/finance-db
# Or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-db

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRY=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=*
```

## 📊 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  role: ObjectId (ref: Role),
  status: 'active' | 'inactive',
  createdAt: Date,
  updatedAt: Date
}
```

### Role Collection
```javascript
{
  _id: ObjectId,
  name: 'Admin' | 'Analyst' | 'Viewer',
  permissions: {
    canViewRecords: Boolean,
    canCreateRecords: Boolean,
    canUpdateRecords: Boolean,
    canDeleteRecords: Boolean,
    canViewUsers: Boolean,
    canCreateUsers: Boolean,
    canUpdateUsers: Boolean,
    canDeleteUsers: Boolean,
    canViewDashboard: Boolean
  },
  description: String,
  createdAt: Date
}
```

### FinancialRecord Collection
```javascript
{
  _id: ObjectId,
  amount: Number,
  type: 'income' | 'expense',
  category: String,
  date: Date,
  description: String,
  notes: String,
  createdBy: ObjectId (ref: User),
  isDeleted: Boolean (soft delete),
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLog Collection
```javascript
{
  _id: ObjectId,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT',
  resourceType: 'User' | 'FinancialRecord' | 'Role' | 'Auth',
  resourceId: ObjectId,
  userId: ObjectId (ref: User),
  changes: Mixed,
  ipAddress: String,
  userAgent: String,
  status: 'success' | 'failure',
  createdAt: Date
}
```

## 🔍 Key Features

### Filtering & Pagination

Records support advanced filtering:
- **Date Range**: `startDate` and `endDate` parameters
- **Category Filter**: Filter by expense/income category
- **Type Filter**: Filter by 'income' or 'expense'
- **Amount Range**: `minAmount` and `maxAmount`
- **Text Search**: Search in notes and description
- **Sorting**: `sortBy` (date, amount) and `sortOrder` (asc, desc)
- **Pagination**: `page` and `limit` parameters

**Example**:
```
GET /api/records?type=expense&category=Food&minAmount=10&maxAmount=100&page=1&limit=20&sortBy=date&sortOrder=desc
```

### Dashboard Analytics

The dashboard endpoints provide efficient aggregation:

- **Summary**: Total income, total expenses, net balance, average amount, record count
- **Category Summary**: Breakdown by category with totals
- **Type Summary**: Income vs Expense comparison
- **Monthly Trends**: Last 12 months trend data
- **Weekly Trends**: Last 12 weeks trend data
- **Recent Activity**: Latest transactions with creator info

All analytics respect user roles:
- Viewers see only their own data
- Analysts and Admins see all data

### Soft Deletes

Financial records are soft-deleted (marked as deleted, not permanently removed):
- Deleted records are excluded from queries by default
- Useful for audit trails and data recovery

### Audit Logging

All significant actions are logged:
- User login/logout
- Record creation/update/deletion
- User management actions
- Status tracking and timestamps

## 🛡️ Security Features

1. **Password Hashing**: Passwords hashed with bcryptjs (salt rounds: 10)
2. **JWT Auth**: Token-based authentication with configurable expiry
3. **CORS**: Configurable cross-origin requests
4. **Rate Limiting**: 100 requests per 15 minutes per IP
5. **Helmet**: Security headers to prevent common vulnerabilities
6. **Input Validation**: Zod schemas for all inputs
7. **Error Handling**: No sensitive info leaked in error messages
8. **Status Checking**: Inactive users cannot access protected routes

## 📈 Performance Optimizations

1. **Database Indexing**: Indexed queries for fast lookups
   - User-created records sorted by date
   - Category and type filtering
   - Date range queries

2. **Aggregation Pipeline**: Efficient MongoDB aggregation for analytics
   - No client-side calculations
   - Server-side filtering and grouping

3. **Pagination**: Large datasets paginated to reduce payload
4. **Select Fields**: Passwords excluded by default from responses

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    { "field": "email", "message": "Invalid email format" }
  ]
}
```

Standard HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request / Validation Error
- `401`: Unauthorized (not authenticated)
- `403`: Forbidden (authenticated but lacks permission)
- `404`: Not Found
- `500`: Internal Server Error

## 📝 Sample Use Cases

### Scenario 1: Analyst Tracking Expenses

1. Login as analyst
2. Create expense records
3. View own records with filters
4. See category-wise breakdown

### Scenario 2: Viewer Monitoring Budget

1. Login as viewer
2. View own dashboard summary
3. Track monthly trends
4. Cannot create or modify records

### Scenario 3: Admin Managing Users

1. Login as admin
2. Create new users and assign roles
3. Activate/deactivate users
4. View all data and user actions

## 🔧 Development

### Running in Development Mode
```bash
npm run dev
```
Auto-restarts on file changes using Nodemon.

### Seeding Database
```bash
npm run seed
```
Populates with 3 demo users and 14 sample financial records.

### Environment Setup
Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

## 🚀 Deployment Considerations

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Generate strong `JWT_SECRET`
- [ ] Configure `CORS_ORIGIN` to specific domain
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable HTTPS
- [ ] Configure rate limiting for production load
- [ ] Set up logging and monitoring
- [ ] Create admin user manually after deployment
- [ ] Backup database regularly

### Deployment Examples

**Heroku**:
```bash
git push heroku main
heroku config:set JWT_SECRET=your_secret MONGODB_URI=your_uri
```

**Docker**:
```bash
docker build -t finance-backend .
docker run -p 5000:5000 -e MONGODB_URI=mongodb://... finance-backend
```

## 🏗️ Design Decisions & Tradeoffs

### Architecture Choices

1. **Service Layer**: Separated business logic from controllers for testability
2. **Middleware Authentication**: Centralized JWT verification
3. **Soft Deletes**: Preserve data integrity for audit trails
4. **MongoDB Aggregation**: Efficient analytics without N+1 queries

### Tradeoffs Made

1. **Soft Delete vs Hard Delete**: Chose soft delete for audit compliance
2. **Sync Operations**: No job queues for simplicity; consider Bull/BullMQ for scale
3. **In-Memory Auth**: No token blacklist; consider Redis for logout functionality
4. **Simple Pagination**: Standard limit-offset; consider cursor-based for huge datasets

### Future Enhancements

- [ ] Unit and integration tests
- [ ] Caching layer (Redis)
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] API key authentication
- [ ] Webhook support for record changes
- [ ] Data export (CSV, PDF)
- [ ] Advanced reporting
- [ ] Budget alerts
- [ ] Recurring transactions

## 🐛 Known Limitations

1. **No test suite**: Production code should include comprehensive tests
2. **No caching**: All queries hit database; add Redis for optimization
3. **No email notifications**: Manual audit trail only
4. **Synchronous operations**: No async job queue
5. **Simple pagination**: Not optimized for millions of records

## 📞 Support & Documentation

- **API Docs**: Visit `/api-docs` for interactive Swagger UI
- **Health Check**: `/health` endpoint for monitoring
- **Error Messages**: Clear and actionable error responses

## 📄 License

This project is provided as-is for the internship assignment.

---

**Built with ❤️ for the Finance Dashboard Internship Assignment**

For questions or issues, refer to the API documentation at `/api-docs`.
