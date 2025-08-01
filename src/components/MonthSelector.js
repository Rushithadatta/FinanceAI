import React from "react";

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const MonthSelector = ({ year, setYear, month, setMonth }) => (
  <div className="month-selector">
    <select value={year} onChange={e => setYear(Number(e.target.value))}>
      {years.map(y => (
        <option key={y} value={y}>{y}</option>
      ))}
    </select>
    <select value={month} onChange={e => setMonth(Number(e.target.value))}>
      {months.map((m, idx) => (
        <option key={m} value={idx}>{m}</option>
      ))}
    </select>
  </div>
);

export default MonthSelector;