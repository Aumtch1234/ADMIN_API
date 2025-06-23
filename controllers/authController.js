const bcrypt = require('bcrypt');
const pool = require('../db');
const jwt = require('jsonwebtoken')

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const userQuery = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);

  if (userQuery.rows.length === 0)
    return res.status(400).json({ message: 'User not found' });

  const user = userQuery.rows[0];
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch)
    return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign(
    {
      username: user.username,
      verify: user.verify, // << เพิ่ม verify ลง token
      role: user.role    // 👈 เพิ่ม role เข้าไป
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  res.json({ token });
};

exports.addAdmin = async (req, res) => {
  const { username: newAdmin, password } = req.body;

  try {
    // 🔍 ตรวจว่ามี user นี้แล้วหรือยัง
    const check = await pool.query('SELECT * FROM admins WHERE username = $1', [newAdmin]);
    if (check.rows.length > 0) {
      return res.status(400).json({ message: 'มีแล้ว' });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO admins (username, password, verify) VALUES ($1, $2, $3)',
      [newAdmin, hashed, false]
    );

    res.status(201).json({ message: 'Admin created (not verified)' });

  } catch (err) {
    console.error('Add admin error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// controllers/adminController.js
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!['user', 'admin', 'm_admin'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role' });
  }

  await pool.query('UPDATE admins SET role = $1 WHERE id = $2', [role, id]);
  res.json({ message: 'Role updated' });
};

