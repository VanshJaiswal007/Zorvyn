import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'REGISTER'],
    required: true,
  },
  resourceType: {
    type: String,
    enum: ['User', 'FinancialRecord', 'Role', 'Auth'],
    required: true,
  },
  resourceId: mongoose.Schema.Types.ObjectId,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  changes: mongoose.Schema.Types.Mixed,
  ipAddress: String,
  userAgent: String,
  status: {
    type: String,
    enum: ['success', 'failure'],
    default: 'success',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Index for querying audit logs
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ resourceType: 1 });

export default mongoose.model('AuditLog', auditLogSchema);
