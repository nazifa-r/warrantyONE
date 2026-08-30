# WarrantyOne Backend

Node.js + Express + MySQL API for the WarrantyOne frontend.

## 1. Install

```bash
cd backend
npm install
```

## 2. Configure

Your `.env` is already filled in with the values you provided
(DB user `root`, database `warrantyone_db`, etc.) — no edits needed
unless your MySQL setup differs. `.env.example` is included as a
reference/template.

## 3. Create the database

```bash
mysql -u root -p -e "CREATE DATABASE warrantyone_db;"
```

## 4. Create the schema

```bash
npm run migrate
```

This creates all tables and seeds `categories`, `brands`, and
`warranty_plans` (Standard/Extended/Premium — matching the plans shown
on the "Register a product" page).

## 5. (Optional) Seed demo data

```bash
npm run seed
```

Creates a demo customer you can log in as:
`ayan@example.com` / `password123`, with one sample product, warranty,
and repair record.

## 6. Run

```bash
npm run dev     # nodemon, auto-restart
# or
npm start
```

Server runs on `http://localhost:5001` (matches the frontend's
`api.js` baseURL). Health check: `GET /api/health`.

## API overview

| Method | Route                              | Notes |
|--------|-------------------------------------|-------|
| POST   | /api/auth/register                  | public |
| POST   | /api/auth/login                     | public |
| GET    | /api/auth/me                        | auth required |
| POST   | /api/auth/logout                    | auth required |
| GET    | /api/products                       | auth — customers see only their own |
| POST   | /api/products                       | auth |
| GET    | /api/products/serial/:serial        | auth |
| GET    | /api/products/:id                   | auth |
| PUT    | /api/products/:id                   | auth |
| DELETE | /api/products/:id                   | auth |
| GET    | /api/products/:id/warranties        | auth |
| GET    | /api/products/:id/repairs           | auth |
| GET    | /api/products/brands                | auth |
| GET    | /api/products/categories            | auth |
| GET    | /api/customers                      | Admin/Retailer |
| GET/PUT| /api/customers/:id                  | auth |
| GET    | /api/warranties/plans               | public |
| POST/PUT/DELETE | /api/warranties/plans/:id | Admin |
| GET/POST | /api/repairs                      | auth |
| PUT    | /api/repairs/:id/status              | Technician/Admin |

Every response follows `{ success: boolean, data?: ..., message?: ... }`,
matching what your existing pages already check
(`response.data.success`, `response.data.data`).

## MySQL-specific notes

- Uses `mysql2/promise` with a connection pool (`config/db.js`).
- The `warranties[]` / `repairs[]` arrays nested inside each product
  (used by `MyProductsPage`, `ProductDetailPage`, the customer
  dashboard) are built with `JSON_ARRAYAGG(JSON_OBJECT(...))` —
  requires **MySQL 5.7.8+** (8.0+ recommended). If you're on an older
  MySQL/MariaDB without JSON support, let me know and I'll switch this
  to a plain join + in-code grouping instead.
- `CHECK` constraints (on `role`, `status` columns) require
  **MySQL 8.0.16+** to actually be enforced — on older versions they're
  silently ignored, so keep the enums the frontend already uses
  (`Customer/Retailer/Technician/Admin`, `Active/Expired/Cancelled`,
  `Pending/In_Progress/Completed/Cancelled`) and it'll behave the same
  either way.
- `npm run migrate` uses a one-off `multipleStatements: true`
  connection to run the whole `schema.sql` file at once; the shared
  pool used everywhere else keeps that off (safer for normal queries).

## Notes on wiring into the frontend

- Your `api.js` was already pointed at `http://localhost:5001/api` and
  needs no change to work — a slightly extended version (adds
  `repairAPI`, and reads `VITE_API_URL` if you set one) is included
  in `frontend-integration/api.js` if you'd like the extras.
- `RegisterProductPage.jsx` picks a warranty plan (Standard/Extended/
  Premium) in the UI but was not actually sending it to the backend —
  `frontend-integration/RegisterProductPage.jsx` has the one-line fix
  (`{ ...form, plan }`) so registering a product creates a matching
  warranty row.
- `AuthContext.jsx`, `LoginPage.jsx`, `RegisterPage.jsx` needed no
  changes — their request/response shapes already match this backend.
