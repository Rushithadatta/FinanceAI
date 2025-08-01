import React from "react";

const BudgetAlert = ({ show }) =>
  show ? (
    <div className="budget-alert animate-shake">
      <img
        src="https://cdn-icons-png.flaticon.com/512/564/564619.png"
        alt="Alert"
        className="alert-icon"
      />
      <span>Budget Exceeded! Please review your expenses.</span>
    </div>
  ) : null;

export default BudgetAlert;