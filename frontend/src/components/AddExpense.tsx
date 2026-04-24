import { useState } from "react";
import { addExpense } from "../api/expenses";
import { CATEGORIES, type ExpenseSetterProps } from "./types/types";
import "../styles/AddExpense.css";

export default function AddExpense({
  setExpenses,
  token,
}: {
  setExpenses: ExpenseSetterProps["setExpenses"];
  token: string;
}) {
  const [category, setCategory] = useState("food");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");

  const POSTExpense = async () => {
    const newExpense = await addExpense(title, Number(amount), category, token);
    setExpenses((prev) => [...prev, newExpense]);
    setTitle("");
    setAmount("");
  };
  return (
    <div className="add-expense">
      <h3>Add Expense</h3>
      <div className="add-row">
        <input
          className="add-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") POSTExpense();
          }}
        />
        <input
          className="add-input"
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") POSTExpense();
          }}
        />
        <select
          className="add-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button className="add-btn" onClick={POSTExpense}>
          Add
        </button>
      </div>
    </div>
  );
}
