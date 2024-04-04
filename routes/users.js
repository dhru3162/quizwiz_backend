const express = require('express');
const { registerUser, loginUser, checkWhoIs, logOutUser } = require('../controller/users');
const { userRegisterValidation, userLoginValidation } = require('../middleware/userValidation');
const { authenticate } = require('../middleware/auth');
const routes = express.Router();


routes.post('/register', userRegisterValidation, registerUser)
routes.post('/login', userLoginValidation, loginUser)
routes.get('/whoAmI', authenticate, checkWhoIs)
routes.post('/logout', authenticate, logOutUser)

module.exports = routes