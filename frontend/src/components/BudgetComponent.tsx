import { useState } from "react";
import type { BudgetProps } from "./types/types";
import { updateBudget } from "../api/auth";

export default function BudgetComponent({
  budget,
  setBudget,
  sumExpenses,
  token,
}: BudgetProps) {
  const [budgetInput, setBudgetInput] = useState("");
  return (
    <div
      className={`budget-section ${sumExpenses > budget && budget > 0 ? "over-budget" : ""}`}
    >
      <div className="budget-bar-container">
        <div
          className="budget-bar"
          style={{
            width: `${Math.min((sumExpenses / budget) * 100, 100)}%`,
          }}
        />
      </div>
      <p className="budget-text">
        {budget > 0
          ? `$${sumExpenses.toFixed(2)} of $${budget.toFixed(2)} budget used`
          : "No budget set"}
      </p>
      <div className="budget-input-row">
        <input
          className="filter-input"
          type="number"
          placeholder="Set budget..."
          value={budgetInput}
          onChange={(e) => setBudgetInput(e.target.value)}
        />
        <button
          className="add-btn"
          onClick={async () => {
            const updated = await updateBudget(token, Number(budgetInput));
            setBudget(Number(updated.budget));
            setBudgetInput("");
          }}
        >
          Set
        </button>
      </div>
    </div>
  );
}
