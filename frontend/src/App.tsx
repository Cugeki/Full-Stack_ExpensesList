import { useState } from "react";
import Login from "./components/Login";
import ExpensesList from "./components/ExpensesList";
import "./styles/global.css";
import "./styles/app.css";
import { Toaster } from "react-hot-toast";

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
      <>
        <Toaster />
        <div className="app-card">
          <div className="app-header">
            <h1>Welcome to the Expense Tracker!</h1>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <ExpensesList token={token} />
        </div>
      </>
    );
}

export default App;
