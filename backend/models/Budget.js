const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mobile: {
    type: String,
    required: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid mobile number']
  },
  year: {
    type: Number,
    required: true,
    min: [2000, 'Year must be after 2000'],
    max: [2100, 'Year must be before 2100']
  },
  month: {
    type: Number,
    required: true,
    min: [0, 'Month must be between 0-11'],
    max: [11, 'Month must be between 0-11']
  },
  amount: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [0, 'Budget amount cannot be negative']
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries and ensure uniqueness
budgetSchema.index({ mobile: 1, year: 1, month: 1 }, { unique: true });
budgetSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);
