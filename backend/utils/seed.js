// Optional: creates a demo customer with a couple of products/warranties/repairs
// so you can log in and see real data without registering manually.
// Run with: npm run seed
require('dotenv').config();
const pool = require('../config/db');
const { hashPassword } = require('./authUtils');

async function seed() {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const passwordHash = await hashPassword('password123');

    // Upsert the demo user
    await conn.execute(
      `INSERT INTO users (full_name, email, password_hash, phone, role)
       VALUES ('Ayan Rahman', 'ayan@example.com', ?, '+8801700000000', 'Customer')
       ON DUPLICATE KEY UPDATE full_name = VALUES(full_name)`,
      [passwordHash]
    );
    const [userRows] = await conn.execute('SELECT user_id FROM users WHERE email = ?', ['ayan@example.com']);
    const userId = userRows[0].user_id;

    // Upsert the linked customer row
    await conn.execute(
      `INSERT INTO customers (user_id) VALUES (?)
       ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)`,
      [userId]
    );
    const [custRows] = await conn.execute('SELECT customer_id FROM customers WHERE user_id = ?', [userId]);
    const customerId = custRows[0].customer_id;

    const [brandRows] = await conn.execute(`SELECT brand_id FROM brands WHERE brand_name = 'Apple'`);
    const [categoryRows] = await conn.execute(`SELECT category_id FROM categories WHERE category_name = 'Laptop'`);

    const [existingProduct] = await conn.execute(
      'SELECT product_id FROM products WHERE serial_number = ?',
      ['DEMO-SERIAL-0001']
    );

    if (existingProduct.length === 0) {
      const [productResult] = await conn.execute(
        `INSERT INTO products (customer_id, category_id, brand_id, product_name, model_number, serial_number, purchase_date, purchase_price)
         VALUES (?, ?, ?, 'MacBook Air M2', 'A2681', 'DEMO-SERIAL-0001', '2025-06-01', 145000)`,
        [customerId, categoryRows[0]?.category_id, brandRows[0]?.brand_id]
      );
      const productId = productResult.insertId;

      const [planRows] = await conn.execute(`SELECT * FROM warranty_plans WHERE plan_name = 'Standard'`);
      await conn.execute(
        `INSERT INTO warranties (product_id, plan_id, plan_name, start_date, end_date, status)
         VALUES (?, ?, ?, '2025-06-01', '2026-06-01', 'Active')`,
        [productId, planRows[0].plan_id, planRows[0].plan_name]
      );
      await conn.execute(
        `INSERT INTO repairs (product_id, issue_type, issue_description, status)
         VALUES (?, 'Battery replacement', 'Battery draining fast', 'Completed')`,
        [productId]
      );
    }

    await conn.commit();
    console.log('✅ Seed complete. Login with ayan@example.com / password123');
  } catch (err) {
    await conn.rollback();
    console.error('❌ Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
