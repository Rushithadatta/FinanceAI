import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AnnualExpenseTable from "./AnnualExpenseTable";

const AnnualExpensePage = () => {
  const { user } = useAuth();
  const mobile = user?.mobile;
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  if (!mobile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="annual-expense-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>
      <AnnualExpenseTable mobile={mobile} year={year} />
    </div>
  );
};

export default AnnualExpensePage;