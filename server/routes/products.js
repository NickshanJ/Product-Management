const express = require('express');
const router = express.Router();
const db = require('../db');

// GET — fetch all active products
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE deleted_at IS NULL'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET — fetch all soft deleted products
router.get('/deleted', async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM products WHERE deleted_at IS NOT NULL'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST — add a new product
router.post('/', async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    const [result] = await db.query(
      'INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)',
      [name, category, price, stock]
    );
    res.status(201).json({
      message: 'Product added successfully',
      id: result.insertId,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — update a product
router.put('/:id', async (req, res) => {
  try {
    const { name, category, price, stock } = req.body;
    await db.query(
      'UPDATE products SET name=?, category=?, price=?, stock=? WHERE id=?',
      [name, category, price, stock, req.params.id]
    );
    res.json({ message: 'Product updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE — soft delete a product
router.delete('/:id', async (req, res) => {
  try {
    await db.query(
      'UPDATE products SET deleted_at = NOW() WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Product soft deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT — restore a soft deleted product
router.put('/:id/restore', async (req, res) => {
  try {
    await db.query(
      'UPDATE products SET deleted_at = NULL WHERE id = ?',
      [req.params.id]
    );
    res.json({ message: 'Product restored successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;