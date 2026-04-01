# Deployment Guide

Complete guide for deploying the Finance Backend API to production.

## 🌍 Deployment Options

### Option 1: Heroku (Recommended for Quick Deployment)

#### Prerequisites
- Heroku account (free at heroku.com)
- Heroku CLI installed
- Git installed

#### Steps

1. **Login to Heroku**
   ```bash
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   heroku create finance-backend-app
   ```

3. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET="generate-random-secret-here"
   heroku config:set MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net/finance-db"
   heroku config:set NODE_ENV="production"
   heroku config:set PORT=5000
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View logs**
   ```bash
   heroku logs --tail
   ```

6. **Access your API**
   ```
   https://finance-backend-app.herokuapp.com
   ```

#### Heroku-specific Setup

Add `Procfile` to project root:
```
web: node server.js
```

### Option 2: Railway (Modern & Simple)

1. **Connect GitHub repository** to Railway
2. **Set environment variables** in Railway dashboard
3. **Deploy** - automatically triggered on push
4. **Access** via Railway-provided URL

### Option 3: AWS Elastic Beanstalk

#### Prerequisites
- AWS account
- AWS CLI installed
- EB CLI installed

#### Steps

1. **Initialize EB**
   ```bash
   eb init -p node.js finance-backend --region us-east-1
   ```

2. **Create environment**
   ```bash
   eb create production
   ```

3. **Set environment variables**
   ```bash
   eb setenv JWT_SECRET="secret" MONGODB_URI="uri" NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### Option 4: DigitalOcean App Platform

1. **Connect GitHub repository**
2. **Specify start command**: `npm start`
3. **Set environment variables** in dashboard
4. **Deploy automatically** on push

### Option 5: Docker + Any Cloud (GCP, Azure, AWS)

#### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

#### Create .dockerignore
```
node_modules
npm-debug.log
.env
.git
.gitignore
README.md
API-TESTING.md
DEPLOYMENT.md
```

#### Build and Deploy
```bash
# Build image
docker build -t finance-backend .

# Run locally
docker run -p 5000:5000 \
  -e MONGODB_URI="mongodb://..." \
  -e JWT_SECRET="secret" \
  finance-backend

# Push to Docker Hub
docker tag finance-backend username/finance-backend
docker push username/finance-backend
```

---

## 🔐 Production Checklist

### Security
- [ ] Change `JWT_SECRET` to strong random value
- [ ] Enable HTTPS (all platforms support this)
- [ ] Set `NODE_ENV=production`
- [ ] Configure `CORS_ORIGIN` to specific domain
- [ ] Enable rate limiting (already configured)
- [ ] Use environment variables for all secrets
- [ ] Implement API key authentication (optional)
- [ ] Enable request logging and monitoring
- [ ] Set up alerting for errors

### Database
- [ ] Use managed MongoDB (Atlas) in production
- [ ] Enable MongoDB backups
- [ ] Set up database replication
- [ ] Configure authentication for DB
- [ ] Monitor database performance
- [ ] Set up index optimization
- [ ] Enable encryption at rest

### Performance
- [ ] Enable caching headers
- [ ] Consider CDN for static content
- [ ] Monitor response times
- [ ] Set up performance alerts
- [ ] Consider database query optimization
- [ ] Implement pagination limits
- [ ] Use connection pooling for MongoDB

### Monitoring & Logging
- [ ] Set up centralized logging (LogRocket, DataDog)
- [ ] Monitor error rates
- [ ] Track API response times
- [ ] Set up uptime monitoring
- [ ] Create automated alerts
- [ ] Monitor resource usage (CPU, memory)
- [ ] Track database performance

### Backup & Recovery
- [ ] Automated MongoDB backups
- [ ] Test restore procedures
- [ ] Document recovery steps
- [ ] Version control configuration
- [ ] Disaster recovery plan

---

## 📊 Environment Variables for Production

Create `.env` for production:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-db

# JWT
JWT_SECRET=your-super-secret-random-string-min-32-chars
JWT_EXPIRY=7d

# Server
PORT=5000
NODE_ENV=production

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting (optional)
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

**Generate strong JWT_SECRET:**
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🚀 Scaling Considerations

### For Small Scale (< 1000 users)
- Single Heroku dyno
- MongoDB Atlas free tier
- Basic monitoring

### For Medium Scale (1000-10000 users)
- 2-3 Heroku dynos with load balancing
- MongoDB Atlas M10 cluster
- Redis for caching
- Separate analytics database

### For Large Scale (> 10000 users)
- Kubernetes cluster (EKS, GKE, AKS)
- MongoDB sharded cluster
- Redis cluster for caching
- Separate microservices
- Message queue (RabbitMQ, Kafka)
- CDN for static content
- DDoS protection

---

## 📈 Performance Optimization

### Database Optimization
```javascript
// Already implemented:
- Indexes on frequently queried fields
- Aggregation pipeline for analytics
- Pagination for large datasets
- Connection pooling (MongoDB default)
```

### Application Optimization
```javascript
// Add caching:
- Redis for session management
- Cache dashboard summaries (5 min TTL)
- Cache user roles and permissions

// Add compression:
- gzip compression for responses
- Enable in production middleware
```

### Example Caching Implementation
```javascript
import redis from 'redis';

const client = redis.createClient({
  url: process.env.REDIS_URL
});

export const getCachedSummary = async (userId) => {
  const key = `summary:${userId}`;
  
  // Check cache
  const cached = await client.get(key);
  if (cached) return JSON.parse(cached);
  
  // Get from DB
  const summary = await getDashboardSummary(userId);
  
  // Cache for 5 minutes
  await client.setex(key, 300, JSON.stringify(summary));
  
  return summary;
};
```

---

## 🔍 Monitoring & Alerting

### Using DataDog

```javascript
import StatsD from 'node-statsd';

const stats = new StatsD();

app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    stats.histogram('request.duration', duration);
    stats.increment(`request.status.${res.statusCode}`);
  });
  
  next();
});
```

### Using Sentry for Error Tracking

```bash
npm install @sentry/node
```

```javascript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

---

## 🧪 Pre-Deployment Testing

### Test Checklist
```bash
# 1. Start server in production mode
NODE_ENV=production npm start

# 2. Test all endpoints
npm run test

# 3. Test authentication
- Register user
- Login
- Access protected route
- Invalid token rejection

# 4. Test authorization
- Viewer access restrictions
- Analyst permissions
- Admin full access

# 5. Test data
- Create records
- Update records
- Delete records
- Filter and search

# 6. Test analytics
- Dashboard summary
- Category breakdown
- Trends data

# 7. Load testing
ab -n 1000 -c 10 http://localhost:5000/api/dashboard/summary

# 8. Error handling
- Invalid inputs
- Missing fields
- Duplicate entries
- Not found resources
```

---

## 🚨 Troubleshooting Production Issues

### Issue: 502 Bad Gateway

**Causes:**
- Application crashed
- Database connection lost
- Out of memory

**Solutions:**
```bash
# Check logs
heroku logs --tail

# Restart app
heroku restart

# Increase dyno size
heroku dyno:upgrade standard-1x
```

### Issue: Slow Response Times

**Solutions:**
- Add Redis caching
- Optimize MongoDB indexes
- Enable gzip compression
- Increase dyno resources
- Use CDN

### Issue: Database Errors

**Solutions:**
- Check MongoDB Atlas status
- Verify connection string
- Check firewall/IP whitelist
- Monitor database performance
- Consider upgrading tier

### Issue: High Error Rate

**Solutions:**
- Check Sentry/error logs
- Review recent deployments
- Check database status
- Verify API keys/secrets
- Monitor rate limits

---

## 📱 API Health Monitoring

### Add Monitoring Endpoint

```javascript
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});
```

### External Monitoring
- UptimeRobot: Free uptime monitoring
- StatusPage: Status page for users
- PagerDuty: Incident alerting

---

## 📋 Deployment Checklist

- [ ] All environment variables set
- [ ] JWT_SECRET is strong and random
- [ ] MONGODB_URI points to production DB
- [ ] NODE_ENV is set to "production"
- [ ] CORS_ORIGIN is restricted
- [ ] SSL/TLS enabled
- [ ] Database backups configured
- [ ] Logging and monitoring set up
- [ ] Rate limiting configured
- [ ] Error tracking enabled
- [ ] Load balancing configured (if applicable)
- [ ] Database replicated/clustered
- [ ] Disaster recovery plan documented
- [ ] Rollback strategy prepared
- [ ] Team trained on production access

---

## 🔄 CI/CD Pipeline Example

Using GitHub Actions:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm install
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.12.12
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "finance-backend-app"
          heroku_email: ${{ secrets.HEROKU_EMAIL }}
```

---

## 💰 Cost Estimation

### Monthly Costs (Estimated)

**Option 1: Heroku**
- Dyno: $7-50/month
- MongoDB Atlas M10: $57/month
- **Total: ~$65-110/month**

**Option 2: AWS**
- EC2 t3.micro: $10/month (free tier eligible)
- RDS MongoDB: $100+/month
- **Total: ~$110+/month**

**Option 3: DigitalOcean**
- App Platform: $12-50/month
- Managed DB: $50+/month
- **Total: ~$62+/month**

---

## 🎓 Learning Resources

- Heroku Documentation: https://devcenter.heroku.com
- MongoDB Atlas: https://docs.atlas.mongodb.com
- Docker Documentation: https://docs.docker.com
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

---

**Last Updated**: April 2026
