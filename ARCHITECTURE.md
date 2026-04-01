# Architecture & Design Documentation

Deep dive into the architecture, design patterns, and technical decisions of the Finance Backend API.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Postman, Frontend, etc)        │
└─────────────────────────────────────────────────────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │   HTTPS/TLS Layer     │
                    └───────────┬───────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                         REVERSE PROXY (Optional)               │
│                         (Nginx/Load Balancer)                  │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS APPLICATION                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Middleware Stack:                                        │  │
│  │ - Helmet (Security Headers)                             │  │
│  │ - CORS                                                  │  │
│  │ - Morgan (Logging)                                      │  │
│  │ - Rate Limiter                                          │  │
│  │ - Body Parser                                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Route Layer:                                             │  │
│  │ - /api/auth                                             │  │
│  │ - /api/users                                            │  │
│  │ - /api/records                                          │  │
│  │ - /api/dashboard                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Controller Layer:                                        │  │
│  │ - Request handling                                      │  │
│  │ - Response formatting                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Service Layer:                                           │  │
│  │ - Business logic                                        │  │
│  │ - Data aggregation                                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                           │                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Middleware & Validators:                                │  │
│  │ - JWT Authentication                                    │  │
│  │ - Authorization (RBAC)                                  │  │
│  │ - Input Validation (Zod)                                │  │
│  │ - Error Handling                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                            │
│                 (Mongoose ODM Models)                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ - User Schema                                            │  │
│  │ - Role Schema                                            │  │
│  │ - FinancialRecord Schema                                 │  │
│  │ - AuditLog Schema                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────┐
│                       MONGODB DATABASE                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ - Collections (Users, Roles, Records, AuditLogs)        │  │
│  │ - Indexes (optimized for queries)                        │  │
│  │ - Replication (optional, production)                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## 📚 Layered Architecture

### 1. **Presentation Layer (Routes)**
Handles incoming HTTP requests and routes them to appropriate controllers.

```javascript
// src/routes/recordRoutes.js
router.post('/', protect, authorize('Analyst', 'Admin'), recordController.createRecord);
```

**Responsibilities:**
- Define API endpoints
- Map HTTP methods to controllers
- Apply middleware

### 2. **Controller Layer**
Processes requests, calls services, and formats responses.

```javascript
export const createRecord = async (req, res, next) => {
  try {
    const recordData = { ...req.body, createdBy: req.user._id };
    const record = await recordService.createRecord(recordData);
    res.status(201).json({ success: true, data: { record } });
  } catch (error) {
    next(error);
  }
};
```

**Responsibilities:**
- Request validation
- Call services
- Format response
- Error handling

### 3. **Service Layer**
Encapsulates business logic and database operations.

```javascript
export const createRecord = async (recordData) => {
  // Business logic
  const record = await FinancialRecord.create(recordData);
  return record.populate('createdBy');
};
```

**Responsibilities:**
- Business logic
- Database operations
- Data transformations
- Aggregations

### 4. **Data Access Layer (Models)**
Mongoose schemas and database interactions.

```javascript
const financialRecordSchema = new mongoose.Schema({
  amount: { type: Number, required: true, min: 0 },
  type: { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // ...
});

// Indexes for performance
financialRecordSchema.index({ createdBy: 1, date: -1 });
financialRecordSchema.index({ category: 1 });
```

**Responsibilities:**
- Schema definition
- Data validation
- Indexing
- Relationships

## 🔐 Authentication & Authorization Architecture

### Authentication Flow

```
┌──────────────┐
│   Client     │
└──────┬───────┘
       │ 1. POST /auth/login
       │    email, password
       ▼
┌──────────────────────────────┐
│ Auth Controller              │
│ - Validate credentials       │
│ - Hash check with bcryptjs   │
└──────┬───────────────────────┘
       │ 2. Generate JWT Token
       ▼
┌──────────────────────────────┐
│ JWT Utility                  │
│ - Sign token with secret     │
│ - Set expiry (7 days)        │
└──────┬───────────────────────┘
       │ 3. Return token
       ▼
┌──────────────┐
│   Client     │
│ Stores token │
└──────┬───────┘
       │ 4. Authorization: Bearer {token}
       │
       ▼
┌──────────────────────────────┐
│ Auth Middleware (protect)    │
│ - Extract token from header  │
│ - Verify with JWT secret     │
│ - Check expiry               │
│ - Check user status          │
└──────┬───────────────────────┘
       │ 5. Attach user to req
       ▼
   Proceed to controller
```

### Authorization Flow

```
User makes request with token
            │
            ▼
    ┌─────────────────┐
    │ protect         │ (Authentication)
    │ Verify token    │
    │ Load user       │
    └────────┬────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │ authorize('Admin')          │ (Authorization)
    │ Check user.role.name        │
    │ Compare with allowed roles  │
    └────────┬────────────────────┘
             │
             ▼
    ┌─────────────────────────────┐
    │ checkPermission()           │ (Permission)
    │ Check specific permission   │
    │ in role.permissions object  │
    └────────┬────────────────────┘
             │
             ▼
    Proceed or 403 Forbidden
```

## 📊 Database Schema Design

### Entity Relationship Diagram

```
┌─────────────────┐          ┌──────────────┐
│     Role        │          │     User     │
├─────────────────┤          ├──────────────┤
│ _id (PK)        │◄────────┬│ _id (PK)     │
│ name            │ 1   Many │ role_id (FK) │
│ permissions     │          │ email        │
│ description     │          │ password     │
│ createdAt       │          │ firstName    │
└─────────────────┘          │ lastName     │
                             │ status       │
                             │ createdAt    │
                             └───────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                                  │
                    │ 1 (creates)                      │
                    ▼                                  │
        ┌────────────────────┐                        │
        │ FinancialRecord    │                        │
        ├────────────────────┤                        │
        │ _id (PK)           │                        │
        │ amount             │                        │
        │ type               │                        │
        │ category           │                        │
        │ date               │                        │
        │ description        │                        │
        │ createdBy_id (FK)──┤◄───────────────────────┘
        │ createdAt          │
        └────────────────────┘

        ┌────────────────────┐
        │ AuditLog           │
        ├────────────────────┤
        │ _id (PK)           │
        │ action             │
        │ resourceType       │
        │ resourceId         │
        │ userId (FK)────────┼──────────┐
        │ changes            │          │
        │ createdAt          │          │
        └────────────────────┘          │
                                        │ (Many-to-One)
                                        │
                                 ┌──────┴─────┐
                                 │ User       │
                                 │ _id (PK)   │
                                 └────────────┘
```

### Indexing Strategy

```javascript
// User Collection
db.users.createIndex({ email: 1 }, { unique: true });

// FinancialRecord Collection
db.financialRecords.createIndex({ createdBy: 1, date: -1 });
db.financialRecords.createIndex({ category: 1 });
db.financialRecords.createIndex({ type: 1 });
db.financialRecords.createIndex({ date: 1 });

// AuditLog Collection
db.auditlogs.createIndex({ userId: 1, createdAt: -1 });
db.auditlogs.createIndex({ action: 1 });
db.auditlogs.createIndex({ resourceType: 1 });
```

**Benefits:**
- Faster queries on frequently searched fields
- Better sort performance
- Reduced CPU usage
- Improved user experience

## 🎯 Design Patterns Used

### 1. **Service Layer Pattern**
Separation of concerns - business logic isolated from routes.

```javascript
// Service Layer
export const createRecord = async (data) => {
  // Business logic here
  return await FinancialRecord.create(data);
};

// Controller uses service
export const createRecord = async (req, res, next) => {
  const record = await recordService.createRecord(req.body);
  res.json({ success: true, data: { record } });
};
```

**Benefits:**
- Easier testing
- Reusable business logic
- Clear responsibilities

### 2. **Middleware Pattern**
Chainable request processing.

```javascript
// Authentication middleware
export const protect = async (req, res, next) => {
  const token = getToken(req);
  if (!token) return next(new AppError('Not authorized', 401));
  
  const decoded = verifyToken(token);
  req.user = await User.findById(decoded.userId).populate('role');
  next();
};

// Usage
app.get('/protected', protect, controller);
```

**Benefits:**
- Reusable across routes
- Clean code organization
- Separation of concerns

### 3. **Strategy Pattern**
Different authorization strategies.

```javascript
// Check role strategy
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role.name)) {
      return next(new AppError('Access denied', 403));
    }
    next();
  };
};

// Usage
router.get('/admin', protect, authorize('Admin'), controller);
router.get('/analyst', protect, authorize('Analyst', 'Admin'), controller);
```

### 4. **Error Handling Pattern**
Centralized error handling.

```javascript
// Custom error class
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Async wrapper
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message
  });
});
```

### 5. **Aggregation Pipeline Pattern**
Efficient data aggregation without client-side processing.

```javascript
// MongoDB aggregation for dashboard
const summary = await FinancialRecord.aggregate([
  { $match: { createdBy: userId, isDeleted: false } },
  {
    $group: {
      _id: null,
      totalIncome: {
        $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] }
      },
      totalExpense: {
        $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] }
      }
    }
  }
]);
```

**Benefits:**
- Server-side processing
- Reduced data transfer
- Better performance

## 🔄 Request/Response Flow Example

### Create Financial Record

```
CLIENT REQUEST:
POST /api/records
Authorization: Bearer eyJhbGc...
Content-Type: application/json
{
  "amount": 1000,
  "type": "income",
  "category": "Salary",
  "description": "Monthly salary"
}

         ▼ (1) Express receives request

REQUEST PIPELINE:
┌─────────────────────────────────┐
│ 1. Helmet Middleware            │ Security headers
├─────────────────────────────────┤
│ 2. CORS Middleware              │ Allow cross-origin
├─────────────────────────────────┤
│ 3. Morgan Middleware            │ Log request
├─────────────────────────────────┤
│ 4. Body Parser                  │ Parse JSON
├─────────────────────────────────┤
│ 5. Rate Limiter                 │ Check rate limit
├─────────────────────────────────┤
│ 6. Router Matching              │ Find route
├─────────────────────────────────┤
│ 7. protect Middleware           │ Verify JWT token
├─────────────────────────────────┤
│ 8. authorize Middleware         │ Check role
├─────────────────────────────────┤
│ 9. validateRequest Middleware   │ Validate input
├─────────────────────────────────┤
│ 10. Controller                  │ Process request
│     - Call service              │
│     - Handle response           │
├─────────────────────────────────┤
│ 11. Error Handler (if error)    │ Format error
└─────────────────────────────────┘

CONTROLLER LOGIC:
┌──────────────────────────────────┐
│ 1. Validate input (already done) │
├──────────────────────────────────┤
│ 2. Add createdBy from req.user   │
├──────────────────────────────────┤
│ 3. Call recordService            │
├──────────────────────────────────┤
│ 4. Log audit event               │
├──────────────────────────────────┤
│ 5. Format response               │
└──────────────────────────────────┘

SERVICE LAYER:
┌──────────────────────────────────┐
│ 1. Create document with data     │
├──────────────────────────────────┤
│ 2. Populate references           │
├──────────────────────────────────┤
│ 3. Return result                 │
└──────────────────────────────────┘

DATABASE:
┌──────────────────────────────────┐
│ Insert into FinancialRecords     │
│ {                                │
│   amount: 1000,                  │
│   type: "income",                │
│   category: "Salary",            │
│   description: "Monthly salary",  │
│   createdBy: ObjectId(...),      │
│   createdAt: 2024-03-15T10:00:00│
│ }                                │
└──────────────────────────────────┘

SUCCESS RESPONSE:
┌──────────────────────────────────┐
│ 201 Created                      │
│ Content-Type: application/json   │
├──────────────────────────────────┤
│ {                                │
│   "success": true,               │
│   "message": "Record created",   │
│   "data": {                      │
│     "record": {                  │
│       "_id": "507f1f77bcf...",  │
│       "amount": 1000,            │
│       "type": "income",          │
│       "category": "Salary",      │
│       "createdBy": {...},        │
│       "createdAt": "2024-03-15"  │
│     }                            │
│   }                              │
│ }                                │
└──────────────────────────────────┘
```

## 🔒 Security Architecture

### Password Security
```javascript
// User Model - Pre-save hook
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  // Generate salt
  const salt = await bcryptjs.genSalt(10);
  // Hash password
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Login - Compare passwords
const isMatch = await user.comparePassword(enteredPassword);
```

**Security Features:**
- Passwords never stored in plain text
- Salt rounds: 10 (2^10 iterations)
- Bcryptjs resistant to rainbow tables
- Timing attack resistant

### JWT Security
```javascript
// Token generation
const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET,  // Secret stored in environment
  { expiresIn: '7d' }       // Short expiry
);

// Token verification
const decoded = jwt.verify(token, JWT_SECRET);
```

**Security Features:**
- Secret key in environment variables
- Short expiry time (7 days)
- Payload verified on each request
- Cannot be forged without secret

### Input Validation
```javascript
// Using Zod schemas
export const createRecordSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.enum([...validCategories]),
});

// Validates before reaching business logic
const validated = await schema.parseAsync(data);
```

**Security Benefits:**
- Prevents injection attacks
- Ensures data consistency
- Validates before database operations
- Type-safe throughout

## 📈 Performance Optimization Strategies

### 1. **Database Indexing**
Pre-computed index trees for fast lookups.

```javascript
// Without index: O(n) scan
db.records.find({ createdBy: userId });

// With index: O(log n) lookup
db.records.createIndex({ createdBy: 1, date: -1 });
```

### 2. **Aggregation Pipeline**
Server-side processing reduces data transfer.

```javascript
// Without aggregation: Transfer all records, process client-side
const records = await Record.find();
const summary = calculateSummary(records); // Client-side

// With aggregation: Process on server, return only result
const summary = await Record.aggregate([
  { $match: { /* filter */ } },
  { $group: { /* aggregate */ } }
]);
```

### 3. **Pagination**
Limit data per response.

```javascript
// Without pagination: Could return 1 million records
const records = await Record.find();

// With pagination: Return 10 records, request more if needed
const page = req.query.page || 1;
const limit = req.query.limit || 10;
const records = await Record.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

### 4. **Field Selection**
Don't return unnecessary data.

```javascript
// Return all fields including passwords
const users = await User.find();

// Return only needed fields
const users = await User.find()
  .select('email firstName lastName role');
  
// Exclude passwords by default
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};
```

### 5. **Caching Strategy** (Future Enhancement)
```javascript
// Cache dashboard for 5 minutes
const cacheKey = `dashboard:${userId}`;
let summary = await redis.get(cacheKey);

if (!summary) {
  summary = await getDashboardSummary(userId);
  await redis.setex(cacheKey, 300, JSON.stringify(summary));
}
```

## 🧪 Testing Architecture (Recommended)

```javascript
// tests/unit/services/recordService.test.js
describe('Record Service', () => {
  describe('createRecord', () => {
    it('should create a record with valid data', async () => {
      const recordData = {
        amount: 100,
        type: 'income',
        category: 'Salary',
        createdBy: userId
      };
      
      const result = await recordService.createRecord(recordData);
      
      expect(result).toBeDefined();
      expect(result.amount).toBe(100);
    });
  });
});

// tests/integration/records.test.js
describe('Records API', () => {
  it('should create a record with valid auth', async () => {
    const res = await request(app)
      .post('/api/records')
      .set('Authorization', `Bearer ${token}`)
      .send({ amount: 100, type: 'income', category: 'Salary' });
    
    expect(res.status).toBe(201);
  });
});
```

## 🔄 Data Flow Diagrams

### Dashboard Analytics Flow
```
User Request (Dashboard)
        │
        ▼
┌───────────────────────────┐
│ Dashboard Controller      │
│ - Get userId from jwt     │
│ - Parse filters           │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ Dashboard Service         │
│ - Build aggregation query │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ MongoDB Aggregation       │
│ Pipeline:                 │
│ 1. $match (filter)        │
│ 2. $group (aggregate)     │
│ 3. $sort (order)          │
│ 4. $project (format)      │
└───────────┬───────────────┘
            │
            ▼
┌───────────────────────────┐
│ Database Returns Result   │
│ {                         │
│   totalIncome: 5000,      │
│   totalExpense: 1000,     │
│   netBalance: 4000        │
│ }                         │
└───────────┬───────────────┘
            │
            ▼
    Return to Client
    JSON Response (201)
```

---

## 📚 Additional Resources

- Express Best Practices: https://expressjs.com/en/advanced/best-practice-security.html
- MongoDB Indexes: https://docs.mongodb.com/manual/indexes/
- JWT Best Practices: https://tools.ietf.org/html/rfc8725
- OWASP Security: https://owasp.org/www-project-top-ten/

---

**Last Updated**: April 2026
