

import React, { useState, useEffect } from "react";
import { getAnnualExpenses, getBudget } from "../utils/expenseUtils";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AnnualExpenseTable = ({ mobile, year }) => {
  const [annualExpenses, setAnnualExpenses] = useState({});
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, [mobile, year]);

  const fetchData = async () => {
    if (!mobile) return;
    
    try {
      setLoading(true);
      
      // Fetch annual expenses
      const expensesData = await getAnnualExpenses(mobile, year);
      setAnnualExpenses(expensesData);

      // Fetch budgets for all months
      const budgetPromises = Array.from({ length: 12 }, (_, idx) => 
        getBudget(mobile, year, idx)
      );
      const budgetResults = await Promise.all(budgetPromises);
      
      const budgetMap = {};
      budgetResults.forEach((budget, idx) => {
        budgetMap[idx] = budget;
      });
      setBudgets(budgetMap);
      
    } catch (error) {
      console.error('Error fetching annual data:', error);
      setError('Failed to load annual expenses');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading annual expenses...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  let annualTotal = 0;

  return (
    <div className="annual-expense-table animate-fade-in">
      <h2 className="annual-title">Annual Expenses for {year}</h2>
      <table className="crystal-table">
        <thead>
          <tr>
            <th>Month</th>
            <th>Budget (₹)</th>
            <th>Status</th>
            <th>Date</th>
            <th>Category</th>
            <th>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          {months.map((m, idx) => {
            const monthExpenses = annualExpenses[idx] || [];
            const budget = budgets[idx] !== undefined && budgets[idx] !== 0 ? budgets[idx] : "-";
            const monthTotal = monthExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
            annualTotal += monthTotal;
            const exceeded = budget !== "-" && monthTotal > budget;

            if (monthExpenses.length === 0) {
              return (
                <React.Fragment key={m}>
                  {/* Full-width separator before each month */}
                  <tr>
                    <td colSpan={6} style={{ padding: 0, background: "transparent" }}>
                      <hr className="month-divider" />
                    </td>
                  </tr>
                  <tr className="month-header-row">
                    <td style={{ fontWeight: 600, background: "#fff" }}>{m}</td>
                    <td style={{ background: "#fff" }}>{budget}</td>
                    <td style={{ background: "#fff" }}>-</td>
                    <td colSpan={3} style={{ color: "#aaa", textAlign: "center", background: "#fff" }}>No expenses</td>
                  </tr>
                </React.Fragment>
              );
            }

            // Sort by date for display
            const sortedExpenses = [...monthExpenses].sort((a, b) => a.date - b.date);

            return (
              <React.Fragment key={m}>
                {/* Full-width separator before each month */}
                <tr>
                  <td colSpan={6} style={{ padding: 0, background: "transparent" }}>
                    <hr className="month-divider" />
                  </td>
                </tr>
                {/* Month header */}
                <tr className="month-header-row">
                  <td style={{ fontWeight: 600, background: "#fff" }}>{m}</td>
                  <td style={{ background: "#fff" }}>{budget}</td>
                  <td style={{ background: "#fff", color: exceeded ? "#ef4444" : "#10b981", fontWeight: 700 }}>
                    {budget === "-" ? "-" : exceeded ? "Exceeded" : "Within"}
                  </td>
                  <td style={{ background: "#fff" }}>{String(sortedExpenses[0].date).padStart(2, "0")}</td>
                  <td style={{ background: "#fff" }}>{sortedExpenses[0].name}</td>
                  <td style={{ background: "#fff" }}>₹{sortedExpenses[0].amount}</td>
                </tr>
                {/* Expense rows (no blank row, start immediately after header) */}
                {sortedExpenses.slice(1).map((exp, i) => (
                  <tr className="expense-row" key={exp._id || i}>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>{String(exp.date).padStart(2, "0")}</td> 
                    <td>{exp.name}</td>
                    <td>₹{exp.amount}</td>
                  </tr>
                ))}
                {/* Total row (no line before total) */}
                <tr className="total-row">
                  <td colSpan={4}></td>
                  <td style={{ fontWeight: 700, textAlign: "right" }}>Total</td>
                  <td style={{ fontWeight: 700 }}>₹{monthTotal}</td>
                </tr>
              </React.Fragment>
            );
          })}
          <tr className="annual-total-row">
            <td colSpan={4}></td>
            <td>Annual Total</td>
            <td>₹{annualTotal}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default AnnualExpenseTable;

