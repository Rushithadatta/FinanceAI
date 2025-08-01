const express = require('express');
const { body, validationResult } = require('express-validator');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/budgets/:year/:month
// @desc    Get budget for a specific year and month
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

    const budget = await Budget.findOne({
      mobile,
      year: yearNum,
      month: monthNum
    });

    res.json({ amount: budget ? budget.amount : 0 });

  } catch (error) {
    console.error('Get budget error:', error);
    res.status(500).json({ message: 'Server error while fetching budget' });
  }
});

// @route   POST /api/budgets
// @desc    Set budget for a specific year and month
// @access  Private
router.post('/', [
  auth,
  body('year')
    .isInt({ min: 2000, max: 2100 })
    .withMessage('Year must be between 2000 and 2100'),
  body('month')
    .isInt({ min: 0, max: 11 })
    .withMessage('Month must be between 0 and 11'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be 0 or greater')
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

    const { year, month, amount } = req.body;
    const mobile = req.user.mobile;
    const userId = req.user._id;

    // Check if budget already exists for this month/year
    let budget = await Budget.findOne({
      mobile,
      year,
      month
    });

    if (budget) {
      // Update existing budget
      budget.amount = amount;
      await budget.save();
    } else {
      // Create new budget
      budget = new Budget({
        userId,
        mobile,
        year,
        month,
        amount
      });
      await budget.save();
    }

    res.json({
      message: 'Budget set successfully',
      budget
    });

  } catch (error) {
    console.error('Set budget error:', error);
    res.status(500).json({ message: 'Server error while setting budget' });
  }
});

// @route   DELETE /api/budgets/:year/:month
// @desc    Delete budget for a specific year and month
// @access  Private
router.delete('/:year/:month', auth, async (req, res) => {
  try {
    const { year, month } = req.params;
    const mobile = req.user.mobile;

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);

    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 0 || monthNum > 11) {
      return res.status(400).json({ message: 'Invalid year or month' });
    }

    const budget = await Budget.findOneAndDelete({
      mobile,
      year: yearNum,
      month: monthNum
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });

  } catch (error) {
    console.error('Delete budget error:', error);
    res.status(500).json({ message: 'Server error while deleting budget' });
  }
});

module.exports = router;
