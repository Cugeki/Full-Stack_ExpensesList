import { useState } from "react";
import { login, register } from "../api/auth";
import "../styles/login.css";

interface Props {
  onLogin: (token: string) => void;
}

export default function Login({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  async function handleLogin() {
    const data = await login(email, password);
    if (data.token) {
      onLogin(data.token);
    } else {
      alert(data.error);
    }
  }

  async function handleRegister() {
    const data = await register(email, password);
    if (data.id) {
      alert("Registration successful! Please log in.");
      setIsRegistering(false);
    } else {
      alert(data.error);
    }
  }
  return (
    <div className="login-card">
      <div className="login-left">
        <h1>{isRegistering ? "Create your account" : "Log in"}</h1>
        <p className="login-subtitle">
          {" "}
          {isRegistering
            ? "Sign up to get started!"
            : "Welcome back, Please log in!"}
        </p>
        <input
          className="login-input"
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="login-btn-primary"
          onClick={isRegistering ? handleRegister : handleLogin}
        >
          {isRegistering ? "Register" : "Login"}
        </button>
        <button
          className="login-btn-secondary"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Back to login" : "Create account   "}
        </button>
      </div>
      <div className="login-right">
        <p>
          "Welcome to our app! Please log in or create an account to get
          started."
        </p>
      </div>
    </div>
  );
}
