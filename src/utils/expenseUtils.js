import { expenseAPI, budgetAPI } from '../services/api';

// Get all expenses for a user, year, and month
export async function getExpenses(mobile, year, month) {
  try {
    const expenses = await expenseAPI.getExpenses(year, month);
    return expenses;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return [];
  }
}

// Add an expense for a user, year, and month
export async function addExpense(mobile, year, month, expense) {
  try {
    const expenseData = {
      year,
      month,
      date: expense.date,
      name: expense.name,
      amount: expense.amount
    };
    const response = await expenseAPI.addExpense(expenseData);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error adding expense:', error);
    const message = error.response?.data?.message || 'Failed to add expense';
    return { success: false, error: message };
  }
}

// Delete an expense
export async function deleteExpense(expenseId) {
  try {
    await expenseAPI.deleteExpense(expenseId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting expense:', error);
    const message = error.response?.data?.message || 'Failed to delete expense';
    return { success: false, error: message };
  }
}

// Get budget for a user, year, and month
export async function getBudget(mobile, year, month) {
  try {
    const response = await budgetAPI.getBudget(year, month);
    return response.amount || 0;
  } catch (error) {
    console.error('Error fetching budget:', error);
    return 0;
  }
}

// Set budget for a user, year, and month
export async function setBudget(mobile, year, month, budget) {
  try {
    const budgetData = {
      year,
      month,
      amount: Number(budget)
    };
    const response = await budgetAPI.setBudget(budgetData);
    return { success: true, data: response };
  } catch (error) {
    console.error('Error setting budget:', error);
    const message = error.response?.data?.message || 'Failed to set budget';
    return { success: false, error: message };
  }
}

// Get annual expenses
export async function getAnnualExpenses(mobile, year) {
  try {
    const expenses = await expenseAPI.getAnnualExpenses(year);
    return expenses;
  } catch (error) {
    console.error('Error fetching annual expenses:', error);
    return {};
  }
}