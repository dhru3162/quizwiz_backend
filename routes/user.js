const express = require('express');
const { authenticate } = require('../middleware/auth');
const { addHistory, getHistory, getScore } = require('../controller/history');

const routes = express.Router();

routes.post('/addhistory', authenticate, addHistory)
routes.get('/history', authenticate, getHistory)
routes.get('/getscore', authenticate, getScore)

module.exports = routes