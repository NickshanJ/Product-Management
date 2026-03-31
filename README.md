# Product Management System

A full-stack product management application built with **React + Vite** (frontend), **Express.js** (backend), and **MySQL** (database).

---

## Features

- Reusable React table component with live search, category filter, and column sorting
- Full CRUD REST API built with Express.js and MySQL
- Soft delete functionality — products are never permanently removed
- Recycle bin to view and restore deleted products
- MySQL trigger that blocks restoring products deleted more than 30 days ago

---

## Project Structure

```
product-management/
├── client/                        # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── ProductTable.jsx   # Task 1 — reusable table with filter + sort
│       │   ├── RecycleBin.jsx     # Task 3 — soft deleted products
│       │   ├── AddProductModal.jsx
│       │   ├── EditProductModal.jsx
│       │   └── DeleteModal.jsx
│       ├── services/
│       │   └── api.js             # Axios API calls
│       └── App.jsx
│
├── server/                        # Express.js backend
│   ├── routes/
│   │   └── products.js            # Task 2 - All API endpoints
│   ├── db.js                      # MySQL connection pool
│   ├── index.js                   # Express app entry point
│   └── .env                       # Environment variables
│
├── database/
│   ├── migration.sql              # Table schema + trigger
│   └── seed.sql                   # Sample product data
│
└── README.md
```

---

## Prerequisites

Make sure you have the following installed before running the project:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | Comes with Node.js |
| MySQL | v8.0+ | https://dev.mysql.com/downloads |

---

## Setup and Installation

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/product-management.git
cd product-management
```

---

### Step 2 — Set Up the Database

Open your MySQL client (MySQL Workbench or Command Prompt) and run:

```bash
mysql -u root -p
```

Then run the migration file to create the database, table, and trigger:

```sql
source database/migration.sql
```

Then run the seed file to insert sample data:

```sql
source database/seed.sql
```

Or you can manually copy and paste the contents of `migration.sql` and `seed.sql` into MySQL Workbench and execute them.

---

### Step 3 — Configure Backend Environment

Navigate to the server folder:

```bash
cd server
```

Create a `.env` file (or edit the existing one) with your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=product_db
PORT=5000
```

> **Note:** Replace `your_mysql_password` with your actual MySQL root password.

---

### Step 4 — Install Backend Dependencies

Inside the `server` folder:

```bash
npm install
```

This installs the following packages:

| Package | Purpose |
|---------|---------|
| express | Web framework for building the REST API |
| mysql2 | MySQL driver with promise/async support |
| cors | Allows the React frontend to communicate with the backend |
| dotenv | Loads environment variables from the .env file |

---

### Step 5 — Install Frontend Dependencies

Open a new terminal and navigate to the client folder:

```bash
cd client
npm install
```

This installs:

| Package | Purpose |
|---------|---------|
| react | Frontend UI library |
| vite | Fast React development server and build tool |
| axios | Makes HTTP requests from frontend to backend API |
| tailwindcss | Utility-first CSS framework for styling |

---

### Step 6 — Start the Backend Server

In the `server` folder:

```bash
node index.js
```

You should see:

```
Server running on port 5000
```

> Make sure MySQL service is running before starting the server.
> Open Administrator Command Prompt and run: `net start mysql80`

---

### Step 7 — Start the Frontend

In the `client` folder:

```bash
npm run dev
```

You should see:

```
VITE ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

### Step 8 — Open in Browser

```
http://localhost:5173
```

---

## API Endpoints

Base URL: `http://localhost:5000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /products | Fetch all active products |
| GET | /products/deleted | Fetch all soft-deleted products |
| POST | /products | Add a new product |
| PUT | /products/:id | Update a product by ID |
| DELETE | /products/:id | Soft delete a product (sets deleted_at) |
| PUT | /products/:id/restore | Restore a soft-deleted product |

---

## Database

### Products Table Schema

```sql
CREATE TABLE products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP NULL DEFAULT NULL
);
```

### Soft Delete Logic

- When a product is deleted, `deleted_at` is set to the current timestamp
- Active products have `deleted_at = NULL`
- Deleted products have a timestamp in `deleted_at`
- Restoring a product sets `deleted_at` back to `NULL`

### MySQL Trigger

A `BEFORE UPDATE` trigger prevents restoring products deleted more than 30 days ago:

```sql
CREATE TRIGGER prevent_restore_after_30_days
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
  IF OLD.deleted_at IS NOT NULL
    AND NEW.deleted_at IS NULL
    AND OLD.deleted_at < NOW() - INTERVAL 30 DAY
  THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot restore product deleted more than 30 days ago';
  END IF;
END;
```

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| DB_HOST | MySQL host | localhost |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | Admin@1234 |
| DB_NAME | Database name | product_db |
| PORT | Backend server port | 5000 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MySQL 8.0 |
| ORM/Driver | mysql2 |

-- ============================================                                                                                                  
-- Product Management System — Migration File                                                                                                    
-- ============================================

-- Step 1: Create the database
CREATE DATABASE IF NOT EXISTS product_db;

-- Step 2: Select the database
USE product_db;

-- Step 3: Create the products table
CREATE TABLE IF NOT EXISTS products (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  price       DECIMAL(10,2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at  TIMESTAMP NULL DEFAULT NULL
);

-- Step 4: Create the soft delete restore trigger
DELIMITER //

CREATE TRIGGER prevent_restore_after_30_days
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
  IF OLD.deleted_at IS NOT NULL
    AND NEW.deleted_at IS NULL
    AND OLD.deleted_at < NOW() - INTERVAL 30 DAY
  THEN
    SIGNAL SQLSTATE '45000'
    SET MESSAGE_TEXT = 'Cannot restore product deleted more than 30 days ago';
  END IF;
END //

DELIMITER ;

-- ============================================                                                                                                 
-- Product Management System — Seed Data                                                                                                         
-- ============================================

USE product_db;

INSERT INTO products (name, category, price, stock) VALUES
('Wireless Headphones', 'Electronics', 2499.00, 124),
('Mechanical Keyboard', 'Electronics', 3999.00, 8),
('USB-C Hub', 'Accessories', 1299.00, 56),
('Gaming Mouse Pro', 'Electronics', 1599.00, 22),
('Laptop Stand', 'Accessories', 2199.00, 14);
