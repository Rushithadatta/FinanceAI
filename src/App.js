import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import logo from "./assets/logo.png";
import AnnualExpensePage from "./components/AnnualExpensePage";
import ChatBot from "./components/ChatBot";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-bg">
          <header className="app-header">
            <img src={logo} alt="Expense Tracker Logo" className="app-logo" />
            <h1>Expense Tracker</h1>
          </header>
          <main>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/annual-expenses" element={<AnnualExpensePage />} />
            </Routes>
            <ChatBot />
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;