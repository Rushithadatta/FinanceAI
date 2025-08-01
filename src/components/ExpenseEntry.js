import React, { useState, useEffect} from "react";
import { addExpense, deleteExpense } from "../utils/expenseUtils";

const getDaysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

const ExpenseEntry = ({ mobile, year, month, expenses, setExpenses, onExpenseChange }) => {
  const [selectedDate, setSelectedDate] = useState(1);
  const [expenseName, setExpenseName] = useState("");
  const [customName, setCustomName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Update local state if parent changes month/year/mobile
  useEffect(() => {
    setSelectedDate(1);
    setExpenseName("");
    setCustomName("");
    setAmount("");
    setError("");
  }, [mobile, year, month]);

  const days = getDaysInMonth(year, month);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!amount || Number(amount) <= 0) {
      setError("Enter a valid amount.");
      setLoading(false);
      return;
    }
    const name = expenseName === "Other" ? customName : expenseName;
    if (!name) {
      setError("Enter expense name.");
      setLoading(false);
      return;
    }

    try {
      const expenseData = {
        date: selectedDate,
        name,
        amount: Number(amount)
      };

      const result = await addExpense(mobile, year, month, expenseData);
      
      if (result.success) {
        // Trigger parent to refresh expenses
        if (onExpenseChange) {
          onExpenseChange();
        }
        
        setAmount("");
        setCustomName("");
        setExpenseName("");
        setError("");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to add expense. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete expense by ID
  const handleDeleteExpense = async (expense) => {
    if (!expense._id) {
      setError("Cannot delete expense - invalid ID");
      return;
    }

    try {
      const result = await deleteExpense(expense._id);
      
      if (result.success) {
        // Trigger parent to refresh expenses
        if (onExpenseChange) {
          onExpenseChange();
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to delete expense. Please try again.");
    }
  };

  return (
    <div className="expense-entry animate-slide-up">
      <h3>Enter Expenses</h3>
      <form onSubmit={handleAddExpense}>
        <select
          value={selectedDate}
          onChange={e => setSelectedDate(Number(e.target.value))}
          disabled={loading}
        >
          {Array.from({ length: days }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {String(i + 1).padStart(2, "0")}-{String(month + 1).padStart(2, "0")}-{year}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Expense Name"
          value={expenseName}
          onChange={e => setExpenseName(e.target.value)}
          required
          disabled={loading}
        />
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min={1}
          required
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Expense"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
      <div className="expense-list">
        <h4>Expenses for {year}-{String(month + 1).padStart(2, "0")}</h4>
        {expenses.length === 0 && <div className="empty">No expenses yet.</div>}
        <ul>
          {expenses
            .sort((a, b) => a.date - b.date)
            .map((exp, idx) => (
              <li key={exp._id || idx} className="expense-row">
                <span className="exp-date">{String(exp.date).padStart(2, "0")}</span>
                <span className="exp-name">{exp.name}</span>
                <span className="exp-amt">₹{exp.amount}</span>
                <button
                  className="delete-expense-btn"
                  title="Delete"
                  onClick={() => handleDeleteExpense(exp)}
                  type="button"
                  disabled={loading}
                >🗑️</button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseEntry;