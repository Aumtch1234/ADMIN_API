// routes/allRoutes.js หรือไฟล์ router ที่ใช้

const express = require('express');
const router = express.Router();
const { login, addAdmin } = require('../controllers/authController');
const {getAllAdmins, verifyAdmin, getPendingAdmins,} = require('../controllers/allAdminController');
const { verifyToken, requireVerified } = require('../middlewares/authMiddleware');

router.post('/login', login);
router.post('/add-admin', addAdmin);

router.patch('/admins/verify/:id', verifyToken, requireVerified, verifyAdmin);  // เพิ่ม verifyAdmin

router.get('/admins/pending', getPendingAdmins); // <-- บรรทัดที่ 15

router.get('/admins/all', verifyToken, requireVerified, getAllAdmins);

module.exports = router;
