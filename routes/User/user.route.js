const express = require('express');
const router = express.Router();
const UserController = require('../../controllers/User/Users.controller');
const auten = require('../../auten');

// Get all users
router.get('/:id', UserController.getUser);

// Get user by ID
router.get('/byid/:id', UserController.getUserById);

// Register new user
router.post('/register', UserController.CreateRegister);

// Update user
router.put('/update-user/:id', auten.user , UserController.UpdateUser);

// Delete user
router.delete('/delete-user/:id',auten.admin , UserController.DeleteUser);

// User login
router.post('/login', UserController.LoginUser);

// Get logged-in user details
router.get('/getme/', auten.user , UserController.getme);

module.exports = router;

