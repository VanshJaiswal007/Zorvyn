import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Role from '../models/Role.js';
import User from '../models/User.js';
import FinancialRecord from '../models/FinancialRecord.js';
import AuditLog from '../models/AuditLog.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Clear existing data
    await Role.deleteMany({});
    await User.deleteMany({});
    await FinancialRecord.deleteMany({});
    await AuditLog.deleteMany({});
    console.log('✓ Cleared existing data');

    // Create roles
    const roles = await Role.create([
      {
        name: 'Viewer',
        permissions: {
          canViewRecords: true,
          canCreateRecords: false,
          canUpdateRecords: false,
          canDeleteRecords: false,
          canViewUsers: false,
          canCreateUsers: false,
          canUpdateUsers: false,
          canDeleteUsers: false,
          canViewDashboard: true,
        },
        description: 'Can only view records and dashboard',
      },
      {
        name: 'Analyst',
        permissions: {
          canViewRecords: true,
          canCreateRecords: true,
          canUpdateRecords: true,
          canDeleteRecords: true,
          canViewUsers: false,
          canCreateUsers: false,
          canUpdateUsers: false,
          canDeleteUsers: false,
          canViewDashboard: true,
        },
        description: 'Can create and manage records, view dashboard',
      },
      {
        name: 'Admin',
        permissions: {
          canViewRecords: true,
          canCreateRecords: true,
          canUpdateRecords: true,
          canDeleteRecords: true,
          canViewUsers: true,
          canCreateUsers: true,
          canUpdateUsers: true,
          canDeleteUsers: true,
          canViewDashboard: true,
        },
        description: 'Full access to all resources',
      },
    ]);
    console.log('✓ Created roles');

    // Create users
    const users = await User.create([
      {
        email: 'admin@finance.com',
        password: 'password123',
        firstName: 'Admin',
        lastName: 'User',
        role: roles[2]._id, // Admin
        status: 'active',
      },
      {
        email: 'analyst@finance.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Analyst',
        role: roles[1]._id, // Analyst
        status: 'active',
      },
      {
        email: 'viewer@finance.com',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Viewer',
        role: roles[0]._id, // Viewer
        status: 'active',
      },
    ]);
    console.log('✓ Created users');

    // Create sample financial records
    const records = await FinancialRecord.create([
      // Income records
      {
        amount: 5000,
        type: 'income',
        category: 'Salary',
        date: new Date('2024-03-01'),
        description: 'Monthly salary',
        notes: 'March salary payment',
        createdBy: users[1]._id,
      },
      {
        amount: 500,
        type: 'income',
        category: 'Investment',
        date: new Date('2024-03-05'),
        description: 'Dividend income',
        notes: 'Quarterly dividend',
        createdBy: users[1]._id,
      },
      {
        amount: 1000,
        type: 'income',
        category: 'Bonus',
        date: new Date('2024-03-10'),
        description: 'Performance bonus',
        createdBy: users[1]._id,
      },
      // Expense records
      {
        amount: 50,
        type: 'expense',
        category: 'Food',
        date: new Date('2024-03-02'),
        description: 'Groceries',
        createdBy: users[1]._id,
      },
      {
        amount: 100,
        type: 'expense',
        category: 'Transport',
        date: new Date('2024-03-03'),
        description: 'Uber rides',
        createdBy: users[1]._id,
      },
      {
        amount: 150,
        type: 'expense',
        category: 'Utilities',
        date: new Date('2024-03-04'),
        description: 'Electricity bill',
        createdBy: users[1]._id,
      },
      {
        amount: 30,
        type: 'expense',
        category: 'Entertainment',
        date: new Date('2024-03-06'),
        description: 'Movie tickets',
        createdBy: users[1]._id,
      },
      {
        amount: 1200,
        type: 'expense',
        category: 'Rent',
        date: new Date('2024-03-01'),
        description: 'Monthly rent',
        createdBy: users[1]._id,
      },
      {
        amount: 200,
        type: 'expense',
        category: 'Healthcare',
        date: new Date('2024-03-07'),
        description: 'Doctor consultation',
        createdBy: users[1]._id,
      },
      {
        amount: 80,
        type: 'expense',
        category: 'Insurance',
        date: new Date('2024-03-08'),
        description: 'Health insurance premium',
        createdBy: users[1]._id,
      },
      // February records
      {
        amount: 5000,
        type: 'income',
        category: 'Salary',
        date: new Date('2024-02-01'),
        description: 'February salary',
        createdBy: users[1]._id,
      },
      {
        amount: 1200,
        type: 'expense',
        category: 'Rent',
        date: new Date('2024-02-01'),
        description: 'February rent',
        createdBy: users[1]._id,
      },
      {
        amount: 150,
        type: 'expense',
        category: 'Utilities',
        date: new Date('2024-02-15'),
        description: 'Electricity bill',
        createdBy: users[1]._id,
      },
      {
        amount: 75,
        type: 'expense',
        category: 'Food',
        date: new Date('2024-02-20'),
        description: 'Restaurant',
        createdBy: users[1]._id,
      },
    ]);
    console.log('✓ Created financial records');

    // Create audit logs
    await AuditLog.create([
      {
        action: 'CREATE',
        resourceType: 'User',
        resourceId: users[1]._id,
        userId: users[0]._id,
        changes: { email: 'analyst@finance.com' },
        status: 'success',
      },
      {
        action: 'CREATE',
        resourceType: 'FinancialRecord',
        resourceId: records[0]._id,
        userId: users[1]._id,
        changes: { amount: 5000, type: 'income' },
        status: 'success',
      },
    ]);
    console.log('✓ Created audit logs');

    console.log('\n✅ Database seeded successfully!\n');
    console.log('Demo Credentials:');
    console.log('─────────────────────────────');
    console.log('Admin User:');
    console.log('  Email: admin@finance.com');
    console.log('  Password: password123');
    console.log('  Role: Admin (Full Access)');
    console.log('─────────────────────────────');
    console.log('Analyst User:');
    console.log('  Email: analyst@finance.com');
    console.log('  Password: password123');
    console.log('  Role: Analyst (Can manage records)');
    console.log('─────────────────────────────');
    console.log('Viewer User:');
    console.log('  Email: viewer@finance.com');
    console.log('  Password: password123');
    console.log('  Role: Viewer (Read-only)');
    console.log('─────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
