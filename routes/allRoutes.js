// routes/allRoutes.js
const express = require('express');
const router = express.Router();

const { login, addAdmin, configAdmin } = require('../controllers/authController');
const { getAllAdmins, verifyAdmin, getPendingAdmins } = require('../controllers/allAdminController');
const { createFood, getFoods, deleteFood, updateFood } = require('../controllers/FoodController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { getUsersGroupedByProvider } = require('../controllers/UsersController');


const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage });

// Auth
router.post('/login', login);
router.post('/add-admin', addAdmin);
router.post('/config-admin', configAdmin);


// Admin Verification
router.patch('/admins/verify/:id', verifyToken, verifyAdmin);
router.get('/admins/pending', getPendingAdmins);
router.get('/admins/all', verifyToken, getAllAdmins);

// Food Menu
router.post('/addfood', verifyToken, upload.single('image'), createFood);
router.get('/foods' , getFoods);
router.delete('/foods/:id', verifyToken, deleteFood);
router.put('/foods/:id', verifyToken, upload.single('image'), updateFood);

//Users Menu
router.get('/users', getUsersGroupedByProvider, verifyToken); // Uncomment if you have a getUsers function

module.exports = router;
