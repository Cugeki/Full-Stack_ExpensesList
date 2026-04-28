import { useEffect, useState } from "react";
import {
  deleteExpense,
  editExpense,
  fetchExpenses,
  togglePaid,
} from "../api/expenses";
import AddExpense from "./AddExpense";
import ExpenseFilter from "./ExpenseFilters";
import ExpenseItems from "./ExpenseItems";
import type { Expense } from "./types/types";
import "../styles/ExpensesList.css";
import PieChartExp from "./PieChartExp";
import { getBudget } from "../api/auth";
import BudgetComponent from "./BudgetComponent";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
export default function ExpensesList({ token }: { token: string }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [sortBy, setSortBy] = useState<
    "amount" | "date" | "title" | "category"
  >("amount");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [groupByMonth, setGroupByMonth] = useState(false);

  const [budget, setBudget] = useState<number>(0);

  const filteredAndSorted = [...expenses]
    .filter((expense) => {
      const matchesSearch = expense.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory
        ? expense.category === filterCategory
        : true;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "amount") return a.amount - b.amount;
      if (sortBy === "date") return a.date.localeCompare(b.date);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "category") return a.category.localeCompare(b.category);
      return 0;
    });
  const groupedByMonth = filteredAndSorted.reduce(
    (acc, expense) => {
      const date = new Date(expense.date);
      const month = date.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!acc[month]) {
        acc[month] = [];
      }
      acc[month].push(expense);
      return acc;
    },
    {} as Record<string, Expense[]>,
  );

  const sortedMonths = Object.entries(groupedByMonth).sort((a, b) => {
    return new Date(b[0]).getTime() - new Date(a[0]).getTime();
  });

  const sumExpenses = filteredAndSorted.reduce(
    (sum, expense) => (expense.paid ? sum : sum + Number(expense.amount)),
    0,
  );
  const delExpense = async (id: number) => {
    await deleteExpense(id, token);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast.success("Expense deleted");
  };

  const onEdit = async (
    id: number,
    title: string,
    amount: number,
    category: string,
  ) => {
    const updated = await editExpense(id, title, amount, category, token);
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    toast.success("Expense saved");
  };

  const onTogglePaid = async (id: number) => {
    const updated = await togglePaid(id, token);
    setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    toast.success(updated.paid ? "Marked as paid" : "Marked as unpaid");
  };

  useEffect(() => {
    const fetchExpense = async () => {
      const data = await fetchExpenses(token);
      setExpenses(data);
    };
    const fetchBudget = async () => {
      const data = await getBudget(token);
      setBudget(Number(data.budget));
    };
    fetchExpense();
    fetchBudget();
  }, [token]);

  return (
    <div className="expenses-layout">
      <div className="expenses-chart">
        <PieChartExp expenses={filteredAndSorted} />
      </div>
      <div className="expenses-left">
        <div className="filters-and-toggle">
          <ExpenseFilter
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            sortBy={sortBy}
            setSortBy={setSortBy}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
          />
          <button
            className={`toggle-btn ${groupByMonth ? "active" : ""}`}
            onClick={() => setGroupByMonth(!groupByMonth)}
          >
            Group by month
          </button>
        </div>
        <div className="expenses-list-container">
          <AnimatePresence mode="wait">
            {groupByMonth ? (
              sortedMonths.map(([month, monthExpenses]) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="month-header">{month}</h3>
                  <ExpenseItems
                    filteredAndSorted={monthExpenses}
                    delExpense={delExpense}
                    onEdit={onEdit}
                    onTogglePaid={onTogglePaid}
                  />
                </motion.div>
              ))
            ) : (
              <ExpenseItems
                filteredAndSorted={filteredAndSorted}
                delExpense={delExpense}
                onEdit={onEdit}
                onTogglePaid={onTogglePaid}
              />
            )}
          </AnimatePresence>
        </div>

        <h3 className="total">Total Expenses: ${sumExpenses.toFixed(2)}</h3>
        <BudgetComponent
          budget={budget}
          setBudget={setBudget}
          token={token}
          sumExpenses={sumExpenses}
        />
      </div>
      <div className="expenses-right">
        <AddExpense setExpenses={setExpenses} token={token} />
      </div>
    </div>
  );
}
