# API Testing Guide

Complete guide for testing the Finance Backend API with examples and curl commands.

## 🚀 Quick Start

### 1. Start the Server

```bash
# With auto-reload (development)
npm run dev

# Or standard mode
npm start
```

Server will run on `http://localhost:5000`

### 2. Seed Database (Optional)

This creates demo users and sample data:

```bash
npm run seed
```

**Demo Credentials After Seeding:**
- Admin: `admin@finance.com` / `password123`
- Analyst: `analyst@finance.com` / `password123`
- Viewer: `viewer@finance.com` / `password123`

### 3. Access API Documentation

Visit: `http://localhost:5000/api-docs`

---

## 📝 Complete API Test Cases

### Authentication Tests

#### 1. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Expected Response (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "email": "newuser@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Viewer",
      "status": "active"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### 2. Login User

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "analyst@finance.com",
    "password": "password123"
  }'
```

**Save the returned token** for subsequent requests.

#### 3. Get Current User Info

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 4. Logout

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### User Management Tests (Admin Only)

#### 1. Get All Users

```bash
# Basic
curl -X GET http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"

# With filters
curl -X GET "http://localhost:5000/api/users?status=active&page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"

# With search
curl -X GET "http://localhost:5000/api/users?search=john" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### 2. Get Single User

```bash
curl -X GET http://localhost:5000/api/users/{USER_ID} \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

#### 3. Create User

```bash
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newanalyst@example.com",
    "password": "password123",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "ANALYST_ROLE_ID",
    "status": "active"
  }'
```

#### 4. Update User

```bash
curl -X PATCH http://localhost:5000/api/users/{USER_ID} \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Updated",
    "lastName": "Name"
  }'
```

#### 5. Assign Role to User

```bash
curl -X PATCH http://localhost:5000/api/users/{USER_ID}/role \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "roleId": "ROLE_ID"
  }'
```

#### 6. Update User Status

```bash
# Deactivate user
curl -X PATCH http://localhost:5000/api/users/{USER_ID}/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'

# Reactivate user
curl -X PATCH http://localhost:5000/api/users/{USER_ID}/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "active"
  }'
```

#### 7. Delete User

```bash
curl -X DELETE http://localhost:5000/api/users/{USER_ID} \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

### Financial Records Tests

#### 1. Create Record

```bash
# Income record
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5000,
    "type": "income",
    "category": "Salary",
    "date": "2024-03-15T10:00:00Z",
    "description": "Monthly salary",
    "notes": "March payment"
  }'

# Expense record
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "type": "expense",
    "category": "Food",
    "date": "2024-03-16T14:30:00Z",
    "description": "Grocery shopping",
    "notes": "Weekly groceries"
  }'
```

**Valid Categories:**
- Income: `Salary`, `Investment`, `Bonus`, `Other Income`
- Expense: `Food`, `Transport`, `Utilities`, `Entertainment`, `Healthcare`, `Education`, `Rent`, `Insurance`, `Other Expense`

#### 2. Get All Records

```bash
# Basic
curl -X GET http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN"

# With pagination
curl -X GET "http://localhost:5000/api/records?page=1&limit=20" \
  -H "Authorization: Bearer TOKEN"
```

#### 3. Filter Records

```bash
# By type and category
curl -X GET "http://localhost:5000/api/records?type=expense&category=Food" \
  -H "Authorization: Bearer TOKEN"

# By date range
curl -X GET "http://localhost:5000/api/records?startDate=2024-03-01&endDate=2024-03-31" \
  -H "Authorization: Bearer TOKEN"

# By amount range
curl -X GET "http://localhost:5000/api/records?minAmount=50&maxAmount=500" \
  -H "Authorization: Bearer TOKEN"

# Text search
curl -X GET "http://localhost:5000/api/records?search=salary" \
  -H "Authorization: Bearer TOKEN"

# Combined filters with sorting
curl -X GET "http://localhost:5000/api/records?type=expense&category=Food&minAmount=10&maxAmount=100&page=1&limit=10&sortBy=date&sortOrder=desc" \
  -H "Authorization: Bearer TOKEN"
```

**Filter Parameters:**
- `startDate` - ISO datetime string
- `endDate` - ISO datetime string
- `category` - Category name
- `type` - "income" or "expense"
- `minAmount` - Minimum amount
- `maxAmount` - Maximum amount
- `search` - Search in notes/description
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 10)
- `sortBy` - "date" or "amount" (default: "date")
- `sortOrder` - "asc" or "desc" (default: "desc")

#### 4. Get Single Record

```bash
curl -X GET http://localhost:5000/api/records/{RECORD_ID} \
  -H "Authorization: Bearer TOKEN"
```

#### 5. Update Record

```bash
curl -X PATCH http://localhost:5000/api/records/{RECORD_ID} \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 5500,
    "notes": "Updated salary information"
  }'
```

#### 6. Delete Record

```bash
curl -X DELETE http://localhost:5000/api/records/{RECORD_ID} \
  -H "Authorization: Bearer TOKEN"
```

---

### Dashboard & Analytics Tests

#### 1. Get Dashboard Summary

```bash
# Overall summary
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer TOKEN"

# Summary for specific date range
curl -X GET "http://localhost:5000/api/dashboard/summary?startDate=2024-03-01&endDate=2024-03-31" \
  -H "Authorization: Bearer TOKEN"
```

**Response Format:**
```json
{
  "success": true,
  "message": "Dashboard summary retrieved",
  "data": {
    "summary": {
      "totalIncome": 6500,
      "totalExpense": 1430,
      "netBalance": 5070,
      "totalRecords": 14,
      "avgAmount": 571.43
    }
  }
}
```

#### 2. Get Category Summary

```bash
curl -X GET http://localhost:5000/api/dashboard/category-summary \
  -H "Authorization: Bearer TOKEN"
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "summary": [
      {
        "_id": "Salary",
        "total": 10000,
        "count": 2,
        "type": "income"
      },
      {
        "_id": "Rent",
        "total": 2400,
        "count": 2,
        "type": "expense"
      }
    ]
  }
}
```

#### 3. Get Type Summary (Income vs Expense)

```bash
curl -X GET http://localhost:5000/api/dashboard/type-summary \
  -H "Authorization: Bearer TOKEN"
```

#### 4. Get Monthly Trends

```bash
# Last 12 months
curl -X GET http://localhost:5000/api/dashboard/monthly-trends \
  -H "Authorization: Bearer TOKEN"
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "year": 2024,
        "month": 3,
        "totalIncome": 6500,
        "totalExpense": 1430,
        "netBalance": 5070,
        "records": 14
      }
    ]
  }
}
```

#### 5. Get Weekly Trends

```bash
curl -X GET http://localhost:5000/api/dashboard/weekly-trends \
  -H "Authorization: Bearer TOKEN"
```

#### 6. Get Recent Activity

```bash
# Last 10 transactions
curl -X GET http://localhost:5000/api/dashboard/recent-activity \
  -H "Authorization: Bearer TOKEN"

# Custom limit
curl -X GET "http://localhost:5000/api/dashboard/recent-activity?limit=20" \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔐 Access Control Testing

### Test 1: Viewer Can Only View

```bash
# Login as viewer
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"viewer@finance.com","password":"password123"}' | jq -r '.data.token')

# This works - viewing records
curl -X GET http://localhost:5000/api/records -H "Authorization: Bearer $TOKEN"

# This FAILS - creating record should return 403
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"type":"expense","category":"Food"}'
```

### Test 2: Analyst Can Create/Update Records

```bash
# Login as analyst
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"analyst@finance.com","password":"password123"}' | jq -r '.data.token')

# This works - creating record
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"type":"expense","category":"Food"}'

# This FAILS - managing users requires Admin
curl -X GET http://localhost:5000/api/users -H "Authorization: Bearer $TOKEN"
```

### Test 3: Admin Has Full Access

```bash
# Login as admin
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"password123"}' | jq -r '.data.token')

# This works - viewing all users
curl -X GET http://localhost:5000/api/users -H "Authorization: Bearer $TOKEN"

# This works - creating record
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"type":"expense","category":"Food"}'

# This works - viewing all records
curl -X GET http://localhost:5000/api/records -H "Authorization: Bearer $TOKEN"
```

---

## ❌ Error Handling Tests

### 1. Invalid Token

```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer INVALID_TOKEN"
```

**Response (401)**:
```json
{
  "success": false,
  "message": "Token is invalid or expired"
}
```

### 2. Missing Token

```bash
curl -X GET http://localhost:5000/api/auth/me
```

**Response (401)**:
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

### 3. Invalid Input

```bash
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": -100,
    "type": "invalid",
    "category": "Unknown"
  }'
```

**Response (400)**:
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [...]
}
```

### 4. Duplicate Email

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@finance.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Response (400)**:
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### 5. Inactive User Access

```bash
# Admin deactivates a user
curl -X PATCH http://localhost:5000/api/users/{USER_ID}/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "inactive"}'

# Try to login as inactive user
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'
```

**Response (403)**:
```json
{
  "success": false,
  "message": "Your account is inactive"
}
```

---

## 🧪 Integration Test Workflow

### Complete User Journey

```bash
#!/bin/bash

# 1. Register new user
echo "=== Registering user ==="
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "testpass123",
    "firstName": "Test",
    "lastName": "User"
  }')

TOKEN=$(echo $RESPONSE | jq -r '.data.token')
USER_ID=$(echo $RESPONSE | jq -r '.data.user.id')
echo "Token: $TOKEN"
echo "User ID: $USER_ID"

# 2. Create some records
echo -e "\n=== Creating income record ==="
curl -s -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 3000,
    "type": "income",
    "category": "Salary",
    "description": "Test salary"
  }' | jq

echo -e "\n=== Creating expense record ==="
curl -s -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 500,
    "type": "expense",
    "category": "Food",
    "description": "Test expense"
  }' | jq

# 3. View dashboard
echo -e "\n=== Viewing dashboard ==="
curl -s -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. Get records with filters
echo -e "\n=== Filtered records ==="
curl -s -X GET "http://localhost:5000/api/records?type=income" \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 📊 Performance Testing

### Load Testing Example (using Apache Bench)

```bash
# Install Apache Bench (if not installed)
# Ubuntu: sudo apt-get install apache2-utils
# Mac: brew install httpd

# Concurrent requests
ab -n 1000 -c 10 -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/dashboard/summary
```

---

## 💡 Tips for Testing

1. **Save Token**: Store JWT in a variable for multiple requests
   ```bash
   TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   ```

2. **Pretty Print JSON**: Use `jq` for readable output
   ```bash
   curl ... | jq
   ```

3. **Test with Postman**: Import the Swagger docs into Postman
   - Swagger URL: `http://localhost:5000/api-docs`

4. **Monitor Database**: Use MongoDB Compass to view data
   ```bash
   mongodb://localhost:27017
   ```

5. **Check Logs**: Enable Morgan logging
   - All requests logged to console

---

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Error
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas
# Update MONGODB_URI in .env
```

### Token Expired
- Register/login to get a new token
- Default expiry: 7 days

### Permission Denied
- Check user role and status
- Admin users get access to `/api/users`
- Analyst/Admin can create/update records
- Viewer can only read

---

**Last Updated**: April 2026
