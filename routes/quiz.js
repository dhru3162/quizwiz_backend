const express = require('express');
const { authenticate } = require('../middleware/auth');
const { getQuiz, addQuiz, getOneQuiz, updateQuiz, deleteQuiz } = require('../controller/quiz');
const routes = express.Router();

routes.get('/', authenticate, getQuiz)
routes.get('/:id', authenticate, getOneQuiz)
routes.post('/add', authenticate, addQuiz)
routes.put('/:id', authenticate, updateQuiz)
routes.delete('/:id', authenticate, deleteQuiz)

module.exports = routes