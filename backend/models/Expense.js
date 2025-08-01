const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
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
  date: {
    type: Number,
    required: true,
    min: [1, 'Date must be between 1-31'],
    max: [31, 'Date must be between 1-31']
  },
  name: {
    type: String,
    required: [true, 'Expense name is required'],
    trim: true,
    maxlength: [100, 'Expense name cannot exceed 100 characters']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
expenseSchema.index({ mobile: 1, year: 1, month: 1 });
expenseSchema.index({ userId: 1, year: 1, month: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
