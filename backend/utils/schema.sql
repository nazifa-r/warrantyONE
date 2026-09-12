-- WarrantyOne database schema (MySQL)
-- Designed to match the exact fields the existing React frontend reads.

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS repairs;
DROP TABLE IF EXISTS warranties;
DROP TABLE IF EXISTS warranty_plans;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS brands;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- ── Users (all roles share one auth table) ─────────────────────────────
CREATE TABLE users (
  user_id       INT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(150) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  phone         VARCHAR(30),
  role          VARCHAR(20) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_role CHECK (role IN ('Customer','Retailer','Technician','Admin'))
) ENGINE=InnoDB;

-- ── Customers (1:1 extension of users with role = Customer) ────────────
CREATE TABLE customers (
  customer_id   INT AUTO_INCREMENT PRIMARY KEY,
  user_id       INT NOT NULL UNIQUE,
  address       VARCHAR(255),
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_customers_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Reference tables ─────────────────────────────────────────────────
CREATE TABLE categories (
  category_id   INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE brands (
  brand_id      INT AUTO_INCREMENT PRIMARY KEY,
  brand_name    VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- ── Products ─────────────────────────────────────────────────────────
CREATE TABLE products (
  product_id      INT AUTO_INCREMENT PRIMARY KEY,
  customer_id     INT NOT NULL,
  category_id     INT,
  brand_id        INT,
  product_name    VARCHAR(150) NOT NULL,
  model_number    VARCHAR(100),
  serial_number   VARCHAR(100) NOT NULL UNIQUE,
  purchase_date   DATE,
  purchase_price  DECIMAL(12,2),
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_products_customer FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE CASCADE,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
  CONSTRAINT fk_products_brand FOREIGN KEY (brand_id) REFERENCES brands(brand_id)
) ENGINE=InnoDB;

-- ── Warranty plans (catalog) ─────────────────────────────────────────
CREATE TABLE warranty_plans (
  plan_id         INT AUTO_INCREMENT PRIMARY KEY,
  plan_name       VARCHAR(50) NOT NULL,       -- Standard / Extended / Premium
  duration_months INT NOT NULL,
  price           DECIMAL(10,2) NOT NULL DEFAULT 0,
  description     VARCHAR(255)
) ENGINE=InnoDB;

-- ── Warranties (one product can have several over time) ────────────
CREATE TABLE warranties (
  warranty_id   INT AUTO_INCREMENT PRIMARY KEY,
  product_id    INT NOT NULL,
  plan_id       INT,
  plan_name     VARCHAR(50) NOT NULL,
  start_date    DATE NOT NULL,
  end_date      DATE NOT NULL,
  status        VARCHAR(20) NOT NULL DEFAULT 'Active',
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_warranties_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  CONSTRAINT fk_warranties_plan FOREIGN KEY (plan_id) REFERENCES warranty_plans(plan_id),
  CONSTRAINT chk_warranties_status CHECK (status IN ('Active','Expired','Cancelled'))
) ENGINE=InnoDB;

-- ── Repairs ──────────────────────────────────────────────────────────
CREATE TABLE repairs (
  repair_id         INT AUTO_INCREMENT PRIMARY KEY,
  product_id        INT NOT NULL,
  issue_type        VARCHAR(100),
  issue_description TEXT,
  request_date      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status            VARCHAR(20) NOT NULL DEFAULT 'Pending',
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_repairs_product FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  CONSTRAINT chk_repairs_status CHECK (status IN ('Pending','In_Progress','Completed','Cancelled'))
) ENGINE=InnoDB;

-- ── Indexes ──────────────────────────────────────────────────────────
CREATE INDEX idx_products_customer ON products(customer_id);
CREATE INDEX idx_products_serial ON products(serial_number);
CREATE INDEX idx_warranties_product ON warranties(product_id);
CREATE INDEX idx_repairs_product ON repairs(product_id);
CREATE INDEX idx_users_email ON users(email);

-- ── Seed reference + plan data ───────────────────────────────────────
INSERT INTO categories (category_name) VALUES
  ('Laptop'), ('Smartphone'), ('Television'), ('Refrigerator'), ('Washing Machine'), ('Air Conditioner'), ('Audio');

INSERT INTO brands (brand_name) VALUES
  ('Samsung'), ('Apple'), ('Sony'), ('LG'), ('Walton'), ('Xiaomi'), ('Dell'), ('HP');

INSERT INTO warranty_plans (plan_name, duration_months, price, description) VALUES
  ('Standard', 12, 0, 'Manufacturer defect coverage from the purchase date.'),
  ('Extended', 24, 1200, 'Adds accidental damage and priority repair slots.'),
  ('Premium', 36, 2400, 'Full coverage plus one free screen or battery swap.');
