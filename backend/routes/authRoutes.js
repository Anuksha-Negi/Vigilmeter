const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

router.post('/login', async (req, res) => {
  const { employee_id, password } = req.body;

  try {
    const [rows] = await pool.query(
      'SELECT * FROM Officers WHERE employee_id = ?',
      [employee_id]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid employee ID or password' });
    }

    const officer = rows[0];
    const isMatch = await bcrypt.compare(password, officer.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid employee ID or password' });
    }

    const token = jwt.sign(
      { id: officer.id, employee_id: officer.employee_id, role: officer.role },
      process.env.JWT_SECRET || 'demo_secret_key',
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Login successful',
      token,
      officer: { name: officer.name, employee_id: officer.employee_id, assigned_area: officer.assigned_area }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;