const express = require('express');
const { body, validationResult } = require('express-validator');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/expenses/annual/:year
// @desc    Get all expenses for a specific year
// @access  Private
router.get('/annual/:year', auth, async (req, res) => {
  try {
    const { year } = req.params;
    const mobile = req.user.mobile;

    console.log('Annual expenses request:', { year, mobile, user: req.user });

    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      console.log('Invalid year provided:', year);
      return res.status(400).json({ message: 'Invalid year' });
    }

    console.log('Searching for expenses with:', { mobile, year: yearNum });

    const expenses = await Expense.find({
      mobile,
      year: yearNum
    }).sort({ month: 1, date: 1 });

    console.log('Found expenses:', expenses.length);

    // Group expenses by month
    const expensesByMonth = {};
    expenses.forEach(expense => {
      if (!expensesByMonth[expense.month]) {
        expensesByMonth[expense.month] = [];
      }
      expensesByMonth[expense.month].push(expense);
    });

    res.json(expensesByMonth);

  } catch (error) {
    console.error('Get annual expenses error:', error);
    res.status(500).json({ message: 'Server error while fetching annual expenses' });
  }
});

// @route   GET /api/expenses/:year/:month
// @desc    Get expenses for a specific year and month
// @access  Private
router.get('/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params;
    const mobile = req.user.mobile;

    // Validate year and month
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
      return res.status(400).json({ message: 'Invalid year or month' });
    }

    const expenses = await Expense.find({
      mobile,
      year: yearNum,
      month: monthNum
    }).sort({ date: 1 });

    res.json(expenses);

  } catch (error) {
    console.error('Get expenses error:', error);
    res.status(500).json({ message: 'Server error while fetching expenses' });
  }
});

// @route   POST /api/expenses
// @desc    Add a new expense
// @access  Private
router.post('/', [
  auth,
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100'),
  body('month')
    .isInt({ min: 0, max: 11 })
    .withMessage('Month must be between 0 and 11'),
  body('date')
    .isInt({ min: 1, max: 31 })
    .withMessage('Date must be between 1 and 31'),
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Expense name must be between 1 and 100 characters'),
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { year, month, date, name, amount } = req.body;
    const mobile = req.user.mobile;
    const userId = req.user._id;

    const expense = new Expense({
      userId,
      mobile,
      year,
      month,
      date,
      name,
      amount
    });

    await expense.save();

    res.status(201).json({
      message: 'Expense added successfully',
      expense
    });

  } catch (error) {
    console.error('Add expense error:', error);
    res.status(500).json({ message: 'Server error while adding expense' });
  }
});

// @route   DELETE /api/expenses/:id
// @desc    Delete an expense
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const mobile = req.user.mobile;

    const expense = await Expense.findOne({ _id: id, mobile });

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    await Expense.findByIdAndDelete(id);

    res.json({ message: 'Expense deleted successfully' });

  } catch (error) {
    console.error('Delete expense error:', error);
    res.status(500).json({ message: 'Server error while deleting expense' });
  }
});

module.exports = router;
