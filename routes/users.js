const express = require('express');
const { registerUser, loginUser, checkWhoIs } = require('../controller/users');
const { userRegisterValidation, userLoginValidation } = require('../middleware/userValidation');
const { authenticate } = require('../middleware/auth');
const routes = express.Router();


routes.post('/register', userRegisterValidation, registerUser)
routes.post('/login', userLoginValidation, loginUser)
routes.post('/whoAmI', authenticate, checkWhoIs)

module.exports = routes