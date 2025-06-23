// routes/allRoutes.js
const express = require('express');
const router = express.Router();

const { login, addAdmin } = require('../controllers/authController');
const { getAllAdmins, verifyAdmin, getPendingAdmins } = require('../controllers/allAdminController');
const { createFood, getFoods, deleteFood, updateFood } = require('../controllers/FoodController');
const { verifyToken, requireVerified } = require('../middlewares/authMiddleware');

const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });

// Auth
router.post('/login', login);
router.post('/add-admin', addAdmin);

// Admin Verification
router.patch('/admins/verify/:id', verifyToken, requireVerified, verifyAdmin);
router.get('/admins/pending', getPendingAdmins);
router.get('/admins/all', verifyToken, requireVerified, getAllAdmins);

// Food Menu
router.post('/addfood', verifyToken, requireVerified, upload.single('image'), createFood);
router.get('/foods' , getFoods);
router.delete('/foods/:id', verifyToken, requireVerified, deleteFood);
router.put('/foods/:id', verifyToken, requireVerified, upload.single('image'), updateFood);

module.exports = router;
