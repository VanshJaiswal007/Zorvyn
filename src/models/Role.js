import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ['Viewer', 'Analyst', 'Admin'],
    required: true,
    unique: true,
  },
  permissions: {
    canViewRecords: { type: Boolean, default: false },
    canCreateRecords: { type: Boolean, default: false },
    canUpdateRecords: { type: Boolean, default: false },
    canDeleteRecords: { type: Boolean, default: false },
    canViewUsers: { type: Boolean, default: false },
    canCreateUsers: { type: Boolean, default: false },
    canUpdateUsers: { type: Boolean, default: false },
    canDeleteUsers: { type: Boolean, default: false },
    canViewDashboard: { type: Boolean, default: false },
  },
  description: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Role', roleSchema);
