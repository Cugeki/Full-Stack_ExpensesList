import { useState } from "react";
import Login from "./components/Login";
import ExpensesList from "./components/ExpensesList";
import "./styles/global.css";
import "./styles/app.css";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  function handleLogin(token: string) {
    setToken(token);
    localStorage.setItem("token", token);
  }

  function handleLogout() {
    setToken(null);
    localStorage.removeItem("token");
  }

  if (!token) {
    return <Login onLogin={handleLogin} />;
  } else
    return (
      <div className="app-card">
        <div className="app-header">
          <h1>Welcome to the Expense Tracker!</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <ExpensesList />
      </div>
    );
}

export default App;
