
import React, { useState, useEffect, useRef } from "react";
import MonthSelector from "./MonthSelector";
import ExpenseEntry from "./ExpenseEntry";
import ExpenseChart from "./ExpenseChart";
import BudgetAlert from "./BudgetAlert";
import AnnualExpenseTable from "./AnnualExpenseTable";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getExpenses, getBudget, setBudget as setBudgetAPI } from "../utils/expenseUtils";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const mobile = user?.mobile;
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth());
  const [budget, setBudget] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [budgetExceeded, setBudgetExceeded] = useState(false);
  const [showAnnual, setShowAnnual] = useState(false);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const name = user?.name;

  // Fetch expenses when mobile, year, or month changes
  useEffect(() => {
    if (mobile) {
      fetchExpenses();
    }
  }, [mobile, year, month]);

  // Fetch budget when mobile, year, or month changes
  useEffect(() => {
    if (mobile) {
      fetchBudget();
    }
  }, [mobile, year, month]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const expensesData = await getExpenses(mobile, year, month);
      setExpenses(expensesData);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudget = async () => {
    try {
      const budgetAmount = await getBudget(mobile, year, month);
      setBudget(budgetAmount || "");
    } catch (error) {
      console.error('Error fetching budget:', error);
    }
  };

  const handleSetBudget = async (e) => {
    e.preventDefault();
    if (!budget || Number(budget) < 0) {
      setError("Please enter a valid budget amount");
      return;
    }

    try {
      const result = await setBudgetAPI(mobile, year, month, budget);
      if (result.success) {
        setError("");
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to set budget. Please try again.");
    }
  };

  const total = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  const overBudgetRef = useRef(false);

  useEffect(() => {
    if (budget && Number(total) > Number(budget)) {
      setBudgetExceeded(true);
      if (!overBudgetRef.current && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance === "function") {
        window.speechSynthesis.cancel();
        const utter = new window.SpeechSynthesisUtterance(
          "Alert! You have exceeded your monthly budget."
        );
        window.speechSynthesis.speak(utter);
        overBudgetRef.current = true;
      }
    } else {
      setBudgetExceeded(false);
      overBudgetRef.current = false;
    }
  }, [budget, total, year, month]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Handle expense changes (additions/deletions)
  const handleExpenseChange = () => {
    fetchExpenses();
  };

  if (!mobile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container animate-fade-in">
      <button className="logout-btn" onClick={handleLogout}>Logout</button>
      <h2>
        Welcome, <span className="highlight">{name}</span>
      </h2>
      <MonthSelector
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
      />
      <form className="budget-form" onSubmit={handleSetBudget}>
        <input
          type="number"
          placeholder="Set monthly budget (₹)"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          min={0}
          required
        />
        <button type="submit">Set Budget</button>
      </form>
      <BudgetAlert show={budgetExceeded} />
      <div className="budget-summary">
        <span>
          <b>Budget:</b> ₹{budget || 0}
        </span>
        <span>
          <b>Total Spent:</b> ₹{total}
        </span>
        <span>
          <b>Remaining:</b> ₹{budget ? Math.max(0, budget - total) : 0}
        </span>
      </div>
      {error && <div className="error">{error}</div>}
      {loading && <div>Loading expenses...</div>}
      <ExpenseEntry
        mobile={mobile}
        year={year}
        month={month}
        expenses={expenses}
        setExpenses={setExpenses}
        onExpenseChange={handleExpenseChange}
      />
      <button
        className="chart-btn"
        onClick={() => setShowChart((prev) => !prev)}
      >
        {showChart ? "Hide Expense Chart" : "Show Expense Chart"}
      </button>
      {showChart && (
        <ExpenseChart
          mobile={mobile}
          year={year}
          month={month}
          expenses={expenses}
        />
      )}
      <button
        className="chart-btn"
        style={{ marginTop: "10px" }}
        onClick={() => navigate("/annual-expenses")}
      >
        Show Annual Expenses
      </button>
      {showAnnual && (
        <AnnualExpenseTable mobile={mobile} year={year} />
      )}
    </div>
  );
};

export default Dashboard;
