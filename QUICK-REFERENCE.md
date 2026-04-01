# Quick Reference Guide

Fast lookup for common tasks and API endpoints.

## 🚀 Getting Started (30 seconds)

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env
# Edit .env and add MongoDB URI

# 3. Seed
npm run seed

# 4. Run
npm run dev

# 5. Test
# Visit: http://localhost:5000/api-docs
```

---

## 🔑 Demo Credentials

```
Admin:    admin@finance.com / password123
Analyst:  analyst@finance.com / password123
Viewer:   viewer@finance.com / password123
```

---

## 🗂️ Project Files at a Glance

| File | What's Inside |
|------|---------------|
| `README.md` | Setup & overview |
| `API-TESTING.md` | Curl examples |
| `DEPLOYMENT.md` | Deploy guide |
| `ARCHITECTURE.md` | Tech details |
| `PROJECT-SUMMARY.md` | Completion status |
| `server.js` | Start here |
| `src/app.js` | Express config |
| `src/models/` | Database schemas |
| `src/routes/` | API endpoints |
| `src/controllers/` | Logic handlers |
| `src/services/` | Business logic |

---

## 📌 Most Important Files

1. **README.md** - Start here!
2. **src/swagger.js** - API documentation
3. **src/models/User.js** - User schema with auth
4. **src/routes/authRoutes.js** - Login/register
5. **src/middlewares/auth.js** - JWT & permissions

---

## 🔗 Quick API Links

```
Base URL:        http://localhost:5000/api
Documentation:   http://localhost:5000/api-docs
Health Check:    http://localhost:5000/health
```

---

## 🔒 Authentication Flow

```bash
# 1. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance.com","password":"password123"}'

# Save returned token

# 2. Use token in all requests
curl -X GET http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Most Used Endpoints

### Create Record
```bash
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 1000,
    "type": "income",
    "category": "Salary",
    "description": "Monthly salary"
  }'
```

### Get Records with Filters
```bash
# All records
curl http://localhost:5000/api/records -H "Authorization: Bearer TOKEN"

# Filter by type
curl 'http://localhost:5000/api/records?type=expense' \
  -H "Authorization: Bearer TOKEN"

# Filter by category and date range
curl 'http://localhost:5000/api/records?category=Food&startDate=2024-03-01&endDate=2024-03-31' \
  -H "Authorization: Bearer TOKEN"
```

### Dashboard Summary
```bash
curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer TOKEN"
```

### Get All Users (Admin Only)
```bash
curl http://localhost:5000/api/users \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## ⚡ Common Tasks

### Create Admin User (After Registering)
```javascript
// In database, change role to Admin
db.users.updateOne(
  { email: "youremail@example.com" },
  { role: ObjectId("ADMIN_ROLE_ID") }
)
```

### Deactivate User
```bash
curl -X PATCH http://localhost:5000/api/users/{USER_ID}/status \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "inactive"}'
```

### Export/Backup Records
```bash
# MongoDB export
mongoexport --db finance-db --collection financialrecords \
  --out records.json

# Or query API and save
curl http://localhost:5000/api/records \
  -H "Authorization: Bearer TOKEN" \
  | jq '.' > records.json
```

---

## 🐛 Troubleshooting

### Server won't start
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Check MongoDB is running
mongod

# Or use MongoDB Atlas in .env
```

### MongoDB connection error
```bash
# Check connection string in .env
MONGODB_URI=mongodb://localhost:27017/finance-db
# Or
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/finance-db
```

### Token expired
```bash
# Get new token
curl -X POST http://localhost:5000/api/auth/login ...
```

### Permission denied
```bash
# Check user role
curl http://localhost:5000/api/auth/me -H "Authorization: Bearer TOKEN"

# Check role has required permissions
db.roles.findOne({ name: "Analyst" })
```

---

## 📈 Record Categories

**Income:**
- Salary
- Investment
- Bonus
- Other Income

**Expense:**
- Food
- Transport
- Utilities
- Entertainment
- Healthcare
- Education
- Rent
- Insurance
- Other Expense

---

## 🔐 Access Control Quick Reference

```
Endpoint                    | Viewer | Analyst | Admin
---------------------------|--------|---------|-------
GET /records                | Own    | All     | All
POST /records               | ❌     | ✅      | ✅
PATCH /records/:id          | ❌     | Own     | All
DELETE /records/:id         | ❌     | Own     | All
GET /dashboard/*            | ✅     | ✅      | ✅
GET /users                  | ❌     | ❌      | ✅
POST /users                 | ❌     | ❌      | ✅
PATCH /users/:id            | ❌     | ❌      | ✅
DELETE /users/:id           | ❌     | ❌      | ✅
```

---

## 🎯 Common Workflows

### Workflow 1: Create and Track Expense
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"analyst@finance.com","password":"password123"}' \
  | jq -r '.data.token')

curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 50,
    "type": "expense",
    "category": "Food",
    "description": "Groceries"
  }'

curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"
```

### Workflow 2: User Management
```bash
# Login as admin
ADMIN_TOKEN=$(...)

# Create user
curl -X POST http://localhost:5000/api/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"email":"newuser@example.com","password":"pass","firstName":"John","lastName":"Doe","role":"ROLE_ID"}'

# List all users
curl http://localhost:5000/api/users -H "Authorization: Bearer $ADMIN_TOKEN"

# Deactivate user
curl -X PATCH http://localhost:5000/api/users/{ID}/status \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"status":"inactive"}'
```

---

## 📞 Environment Variables

```env
# Must have
MONGODB_URI=mongodb://localhost:27017/finance-db
JWT_SECRET=any-random-string

# Optional
PORT=5000                    # Default: 5000
NODE_ENV=development         # or production
JWT_EXPIRY=7d               # Token expiry
CORS_ORIGIN=*               # CORS settings
```

---

## 🧪 Test Cases (5 minutes)

```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'

# 2. Login
TOKEN=$(curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.data.token')

# 3. Create record
curl -X POST http://localhost:5000/api/records \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":100,"type":"income","category":"Salary"}'

# 4. View dashboard
curl http://localhost:5000/api/dashboard/summary \
  -H "Authorization: Bearer $TOKEN"

# 5. Logout
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🚀 Deployment (Choose One)

### Heroku (5 minutes)
```bash
heroku login
heroku create finance-backend-app
heroku config:set JWT_SECRET="$(openssl rand -base64 32)"
heroku config:set MONGODB_URI="mongodb+srv://..."
git push heroku main
```

### Docker (10 minutes)
```bash
docker build -t finance-backend .
docker run -p 5000:5000 \
  -e MONGODB_URI="mongodb://..." \
  -e JWT_SECRET="secret" \
  finance-backend
```

### Railway (2 minutes)
- Connect GitHub repo to Railway
- Set env vars in dashboard
- Deploy

---

## 📚 Quick Code Locations

| Task | File |
|------|------|
| Add new endpoint | `src/routes/*.js` |
| Change role permissions | `src/models/Role.js` |
| Modify validation | `src/validators/*.js` |
| Business logic | `src/services/*.js` |
| Error messages | `src/middlewares/errorHandler.js` |
| JWT settings | `src/config/database.js` |
| API docs | `src/swagger.js` |

---

## 🎯 Performance Tips

- Use pagination: `?page=1&limit=10`
- Filter by date: `?startDate=2024-03-01&endDate=2024-03-31`
- Sort descending: `?sortOrder=desc`
- Search text: `?search=salary`
- Combine filters: `?type=expense&category=Food&minAmount=10&maxAmount=100`

---

## 💾 Backup & Restore

```bash
# Backup MongoDB
mongodump --db finance-db --out ./backup

# Restore MongoDB
mongorestore ./backup

# Export to JSON
mongoexport --db finance-db --collection financialrecords --out records.json

# Import from JSON
mongoimport --db finance-db --collection financialrecords records.json
```

---

## 🔗 HTTP Status Codes Used

```
200 OK                    - Success
201 Created               - Resource created
400 Bad Request          - Invalid input
401 Unauthorized         - Missing/invalid token
403 Forbidden            - Lacks permission
404 Not Found            - Resource not found
500 Internal Server Error - Server error
```

---

## 📖 Where to Find Things

| I need... | Find it in |
|-----------|-----------|
| API endpoints | `/api-docs` or `API-TESTING.md` |
| Setup instructions | `README.md` |
| Deployment help | `DEPLOYMENT.md` |
| Architecture details | `ARCHITECTURE.md` |
| Code structure | Project folders |
| Database schema | `src/models/*.js` |
| Authentication | `src/middlewares/auth.js` |
| Validation | `src/validators/*.js` |
| Business logic | `src/services/*.js` |

---

## ⚙️ npm Scripts

```bash
npm start           # Run production
npm run dev         # Run development (with auto-reload)
npm run seed        # Populate demo data
npm test            # Run tests (when added)
```

---

## 🎓 Learning Path

1. **Start**: Read `README.md`
2. **Understand**: Review `src/app.js`
3. **Explore**: Try API at `/api-docs`
4. **Deep-dive**: Read `ARCHITECTURE.md`
5. **Extend**: Add your own features
6. **Deploy**: Follow `DEPLOYMENT.md`

---

## 🆘 Need Help?

1. **API documentation**: Visit `/api-docs`
2. **Testing examples**: See `API-TESTING.md`
3. **Deployment guide**: Check `DEPLOYMENT.md`
4. **Architecture**: Read `ARCHITECTURE.md`
5. **Setup issues**: Review `README.md`

---

**Last Updated**: April 2026  
**Quick Reference v1.0**

---

# Quick Links

- 📖 [Full README](./README.md)
- 🧪 [API Testing](./API-TESTING.md)
- 🚀 [Deployment](./DEPLOYMENT.md)
- 🏗️ [Architecture](./ARCHITECTURE.md)
- ✅ [Project Summary](./PROJECT-SUMMARY.md)
- 📊 [Swagger Docs](http://localhost:5000/api-docs)
