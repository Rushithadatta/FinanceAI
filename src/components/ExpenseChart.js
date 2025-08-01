import React, { useEffect, useRef } from "react";
// Chart.js CDN: https://cdn.jsdelivr.net/npm/chart.js

const colors = [
  "#6366f1", "#f59e42", "#10b981", "#f43f5e", "#fbbf24",
  "#3b82f6", "#a21caf", "#14b8a6", "#eab308", "#ef4444"
];

const ExpenseChart = ({ expenses }) => {
  const chartRef = useRef();

  useEffect(() => {
    if (!expenses.length) return;
    // Dynamically load Chart.js from CDN
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.onload = () => {
      const Chart = window.Chart;
      if (chartRef.current && Chart) {
        // Group by expense name
        const grouped = {};
        expenses.forEach((e) => {
          grouped[e.name] = (grouped[e.name] || 0) + Number(e.amount);
        });
        const data = {
          labels: Object.keys(grouped),
          datasets: [
            {
              data: Object.values(grouped),
              backgroundColor: colors,
            },
          ],
        };
        if (chartRef.current.chartInstance) {
          chartRef.current.chartInstance.destroy();
        }
        chartRef.current.chartInstance = new Chart(chartRef.current, {
          type: "pie",
          data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "bottom",
                labels: { color: "#222", font: { size: 16 } }
              },
              title: {
                display: true,
                text: "Monthly Expense Distribution",
                color: "#6366f1",
                font: { size: 20, weight: "bold" }
              }
            }
          }
        });
      }
    };
    document.body.appendChild(script);
    return () => {
      if (chartRef.current && chartRef.current.chartInstance) {
        chartRef.current.chartInstance.destroy();
      }
    };
  }, [expenses]);

  return (
    <div className="expense-chart animate-fade-in">
      <canvas ref={chartRef} width={320} height={320}></canvas>
    </div>
  );
};

export default ExpenseChart;