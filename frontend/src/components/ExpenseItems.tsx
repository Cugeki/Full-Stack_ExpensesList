import type { Expense } from "./types/types";
import "../styles/ExpenseItems.css";

export default function ExpenseItems({
  filteredAndSorted,
  delExpense,
}: {
  filteredAndSorted: Expense[];
  delExpense: (id: number) => Promise<void>;
}) {
  if (filteredAndSorted.length === 0) {
    return <p className="no-expenses">No expenses to display</p>;
  } else
    return (
      <>
        <ul className="expenses-list">
          {filteredAndSorted.map((expense: Expense) => (
            <li key={expense.id} className="expense-item">
              <div className="expense-info">
                <span className="expense-title">{expense.title}</span>
                <span className="expense-meta">
                  {expense.category} · {expense.date}
                </span>
              </div>
              <div className="expense-right">
                <span className="expense-amount">${expense.amount}</span>
                <button
                  className="delete-btn"
                  onClick={() => delExpense(expense.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </>
    );
}
