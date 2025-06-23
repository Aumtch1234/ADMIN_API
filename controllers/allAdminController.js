// controllers/allAdminController.js (หรือไฟล์ controller ที่เหมาะสม)

const pool = require('../db');

exports.verifyAdmin = async (req, res) => {
  const { id } = req.params;
  const { role, verify } = req.body;

  const updates = [];
  const values = [];

  if (role !== undefined) {
    if (!['user', 'admin', 'm_admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    updates.push(`role = $${updates.length + 1}`);
    values.push(role);
  }

  if (verify !== undefined) {
    if (typeof verify !== 'boolean') {
      return res.status(400).json({ message: 'Invalid verify value' });
    }
    updates.push(`verify = $${updates.length + 1}`);
    values.push(verify);
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  values.push(id); // for WHERE clause

  try {
    await pool.query(
      `UPDATE admins SET ${updates.join(', ')} WHERE id = $${updates.length + 1}`,
      values
    );

    res.json({ message: 'Admin updated successfully' });
  } catch (err) {
    console.error('Error verifying admin:', err);
    res.status(500).json({ message: 'Server error' });
  }
};



exports.getPendingAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, username, verify, role FROM admins ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pending admins:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllAdmins = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT *, username, verify, role FROM admins ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching pending admins:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
