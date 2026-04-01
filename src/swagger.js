const swaggerDoc = {
  swagger: '2.0',
  info: {
    title: 'Finance Backend API',
    description: 'Complete backend for a finance dashboard system with role-based access control',
    version: '1.0.0',
    contact: {
      name: 'Finance Team',
    },
  },
  host: process.env.RAILWAY_DOMAIN || 'localhost:5000',
  basePath: '/api',
  schemes: ['https', 'http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      description: 'JWT Bearer token. Enter token value directly without "Bearer" prefix. The system will add "Bearer " automatically.',
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Authentication'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['email', 'password', 'firstName', 'lastName'],
              properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'password123' },
                firstName: { type: 'string', example: 'John' },
                lastName: { type: 'string', example: 'Doe' },
              },
            },
          },
        ],
        responses: {
          201: {
            description: 'User registered successfully',
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
                data: {
                  type: 'object',
                  properties: {
                    user: { type: 'object' },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error or duplicate email',
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login user',
        tags: ['Authentication'],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: { type: 'string', example: 'user@example.com' },
                password: { type: 'string', example: 'password123' },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'User logged in successfully',
          },
          401: {
            description: 'Invalid credentials',
          },
          403: {
            description: 'User account is inactive',
          },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get current authenticated user',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Current user data',
          },
          401: {
            description: 'Not authenticated',
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'Logout user',
        tags: ['Authentication'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'User logged out successfully',
          },
        },
      },
    },
    '/users': {
      get: {
        summary: 'Get all users (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'status', in: 'query', type: 'string', enum: ['active', 'inactive'] },
          { name: 'search', in: 'query', type: 'string' },
          { name: 'page', in: 'query', type: 'integer', default: 1 },
          { name: 'limit', in: 'query', type: 'integer', default: 10 },
        ],
        responses: {
          200: { description: 'List of users' },
          401: { description: 'Not authenticated' },
          403: { description: 'Access denied - Admin only' },
        },
      },
      post: {
        summary: 'Create new user (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['email', 'password', 'firstName', 'lastName', 'role'],
              properties: {
                email: { type: 'string' },
                password: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                role: { type: 'string' },
                status: { type: 'string', enum: ['active', 'inactive'] },
              },
            },
          },
        ],
        responses: {
          201: { description: 'User created' },
          400: { description: 'Validation error' },
          403: { description: 'Access denied' },
        },
      },
    },
    '/users/{id}': {
      get: {
        summary: 'Get user by ID (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }],
        responses: {
          200: { description: 'User data' },
          404: { description: 'User not found' },
        },
      },
      patch: {
        summary: 'Update user (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          {
            name: 'body',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                email: { type: 'string' },
                firstName: { type: 'string' },
                lastName: { type: 'string' },
                status: { type: 'string', enum: ['active', 'inactive'] },
              },
            },
          },
        ],
        responses: {
          200: { description: 'User updated' },
          404: { description: 'User not found' },
        },
      },
      delete: {
        summary: 'Delete user (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }],
        responses: {
          200: { description: 'User deleted' },
          404: { description: 'User not found' },
        },
      },
    },
    '/users/{id}/role': {
      patch: {
        summary: 'Assign role to user (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['roleId'],
              properties: {
                roleId: { type: 'string' },
              },
            },
          },
        ],
        responses: {
          200: { description: 'Role assigned' },
        },
      },
    },
    '/users/{id}/status': {
      patch: {
        summary: 'Update user status (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['status'],
              properties: {
                status: { type: 'string', enum: ['active', 'inactive'] },
              },
            },
          },
        ],
        responses: {
          200: { description: 'Status updated' },
        },
      },
    },
    '/records': {
      post: {
        summary: 'Create financial record (Analyst, Admin)',
        tags: ['Records'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'body',
            in: 'body',
            required: true,
            schema: {
              type: 'object',
              required: ['amount', 'type', 'category'],
              properties: {
                amount: { type: 'number', example: 100 },
                type: { type: 'string', enum: ['income', 'expense'] },
                category: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                description: { type: 'string' },
                notes: { type: 'string' },
              },
            },
          },
        ],
        responses: {
          201: { description: 'Record created' },
          400: { description: 'Validation error' },
          403: { description: 'Access denied' },
        },
      },
      get: {
        summary: 'Get financial records (All authenticated users)',
        tags: ['Records'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', type: 'string', format: 'date-time' },
          { name: 'endDate', in: 'query', type: 'string', format: 'date-time' },
          { name: 'category', in: 'query', type: 'string' },
          { name: 'type', in: 'query', type: 'string', enum: ['income', 'expense'] },
          { name: 'minAmount', in: 'query', type: 'number' },
          { name: 'maxAmount', in: 'query', type: 'number' },
          { name: 'search', in: 'query', type: 'string' },
          { name: 'page', in: 'query', type: 'integer', default: 1 },
          { name: 'limit', in: 'query', type: 'integer', default: 10 },
          { name: 'sortBy', in: 'query', type: 'string', enum: ['date', 'amount'] },
          { name: 'sortOrder', in: 'query', type: 'string', enum: ['asc', 'desc'] },
        ],
        responses: {
          200: { description: 'List of records' },
        },
      },
    },
    '/records/{id}': {
      get: {
        summary: 'Get record by ID',
        tags: ['Records'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }],
        responses: {
          200: { description: 'Record data' },
          404: { description: 'Record not found' },
        },
      },
      patch: {
        summary: 'Update record (Analyst, Admin)',
        tags: ['Records'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, type: 'string' },
          {
            name: 'body',
            in: 'body',
            schema: {
              type: 'object',
              properties: {
                amount: { type: 'number' },
                type: { type: 'string', enum: ['income', 'expense'] },
                category: { type: 'string' },
                date: { type: 'string', format: 'date-time' },
                description: { type: 'string' },
                notes: { type: 'string' },
              },
            },
          },
        ],
        responses: {
          200: { description: 'Record updated' },
        },
      },
      delete: {
        summary: 'Delete record (Analyst, Admin)',
        tags: ['Records'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, type: 'string' }],
        responses: {
          200: { description: 'Record deleted' },
        },
      },
    },
    '/dashboard/summary': {
      get: {
        summary: 'Get dashboard summary',
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', type: 'string', format: 'date-time' },
          { name: 'endDate', in: 'query', type: 'string', format: 'date-time' },
        ],
        responses: {
          200: { description: 'Dashboard summary with totals' },
        },
      },
    },
    '/dashboard/category-summary': {
      get: {
        summary: 'Get category-wise summary',
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', type: 'string', format: 'date-time' },
          { name: 'endDate', in: 'query', type: 'string', format: 'date-time' },
        ],
        responses: {
          200: { description: 'Summary by category' },
        },
      },
    },
    '/dashboard/monthly-trends': {
      get: {
        summary: 'Get monthly trends',
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Monthly trend data' },
        },
      },
    },
    '/dashboard/weekly-trends': {
      get: {
        summary: 'Get weekly trends',
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Weekly trend data' },
        },
      },
    },
    '/dashboard/recent-activity': {
      get: {
        summary: 'Get recent transactions',
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'limit', in: 'query', type: 'integer', default: 10 }],
        responses: {
          200: { description: 'Recent activity' },
        },
      },
    },
    '/dashboard/type-summary': {
      get: {
        summary: 'Get summary by type (income/expense)',
        tags: ['Dashboard'],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'startDate', in: 'query', type: 'string', format: 'date-time' },
          { name: 'endDate', in: 'query', type: 'string', format: 'date-time' },
        ],
        responses: {
          200: { description: 'Summary by type' },
        },
      },
    },
  },
  definitions: {
    User: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        email: { type: 'string' },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        role: { type: 'object' },
        status: { type: 'string', enum: ['active', 'inactive'] },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
    FinancialRecord: {
      type: 'object',
      properties: {
        _id: { type: 'string' },
        amount: { type: 'number' },
        type: { type: 'string', enum: ['income', 'expense'] },
        category: { type: 'string' },
        date: { type: 'string', format: 'date-time' },
        description: { type: 'string' },
        notes: { type: 'string' },
        createdBy: { type: 'object' },
        createdAt: { type: 'string', format: 'date-time' },
      },
    },
  },
};

export default swaggerDoc;
