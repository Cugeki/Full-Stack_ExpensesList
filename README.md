# Expense Tracker

A full-stack expense tracking application built with React, TypeScript, Node.js, Express, and PostgreSQL.

## Tech Stack

**Frontend**

- React + TypeScript
- Vite
- Recharts
- CSS

**Backend**

- Node.js + Express
- TypeScript
- PostgreSQL (Docker)
- JWT Authentication
- bcrypt

## Features

- User registration and login
- JWT authentication
- Per-user expenses — each user only sees their own data
- Add, edit and delete expenses
- Mark expenses as paid — paid expenses excluded from total
- Categories — food, transport, entertainment, health, shopping, other
- Filter by title and category
- Sort by amount, date, title or category
- Budget limit with progress bar
- Pie chart visualization of spending by category

## Project Structure

```
expense-tracker/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   └── expenseRouter.ts
│   │   ├── middleware/
│   │   │   └── authenticate.ts
│   │   ├── db.ts
│   │   └── server.ts
│   ├── .env
│   ├── tsconfig.json
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── auth.ts
    │   │   └── expenses.ts
    │   ├── components/
    │   │   ├── types/
    │   │   │   └── types.ts
    │   │   ├── AddExpense.tsx
    │   │   ├── ExpenseFilters.tsx
    │   │   ├── ExpenseItems.tsx
    │   │   ├── ExpensesList.tsx
    │   │   ├── Login.tsx
    │   │   └── PieChartExp.tsx
    │   ├── styles/
    │   └── App.tsx
    └── package.json
```

## Getting Started

### Prerequisites

- Node.js
- Docker

### 1. Clone the repository

```bash
git clone https://github.com/Cugeki/expense-tracker.git
cd expense-tracker
```

### 2. Start the database

```bash
docker run --name expensedb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=expenses \
  -p 5433:5432 \
  -d postgres
```

Then create the tables:

```bash
docker exec -it expensedb psql -U postgres -d expenses
```

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  budget DECIMAL DEFAULT 0
);

CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount DECIMAL NOT NULL,
  title TEXT NOT NULL,
  date DATE,
  user_id INTEGER REFERENCES users(id),
  category TEXT,
  paid BOOLEAN DEFAULT FALSE
);
```

### 3. Set up environment variables

Create a `.env` file in the `backend` folder:
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=expenses
JWT_SECRET=yoursecretkey

### 4. Start the app

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## API Endpoints

### Auth

| Method | Route              | Description                   |
| ------ | ------------------ | ----------------------------- |
| POST   | /api/auth/register | Register a new user           |
| POST   | /api/auth/login    | Login and receive a JWT token |
| GET    | /api/auth/budget   | Get user's budget             |
| PATCH  | /api/auth/budget   | Update user's budget          |

### Expenses (require Authorization header)

| Method | Route                  | Description                         |
| ------ | ---------------------- | ----------------------------------- |
| GET    | /api/expenses          | Get all expenses for logged in user |
| POST   | /api/expenses          | Create a new expense                |
| PATCH  | /api/expenses/:id      | Edit an expense                     |
| PATCH  | /api/expenses/:id/paid | Toggle paid status                  |
| DELETE | /api/expenses/:id      | Delete an expense                   |

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer your_jwt_token
```
