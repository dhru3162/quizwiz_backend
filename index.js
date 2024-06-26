const express = require('express');
const cors = require('cors')
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require("./swagger_output.json");
const { userRegisterValidation, userLoginValidation } = require('./middleware/userValidation');
const { registerUser, loginUser, checkWhoIs, logOutUser, changePassword, forgotPassword, checkLink, ResetPassword } = require('./controller/auth');
const { authenticate, changePasswordValidate, forgotPasswordValidation, ResetPasswordValidate } = require('./middleware/auth');
const { getQuiz, getOneQuiz, addQuiz, updateQuiz, deleteQuiz, addQuestion, editQuestion, deleteQuestion } = require('./controller/quiz');
const { validateRole } = require('./middleware/validateRole');
const { addHistory, getHistory, getScore, getUsersData } = require('./controller/users');
const { contactUs } = require('./controller/contact');
require('dotenv').config();
require('./database/db');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.static('public'));
app.use(cors())
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// auth routes
app.post('/auth/register', userRegisterValidation, registerUser)
app.post('/auth/login', userLoginValidation, loginUser)
app.post('/auth/forgot-password', forgotPasswordValidation, forgotPassword)
app.post('/auth/check-link', checkLink)
app.post('/auth/reset-password', ResetPasswordValidate, ResetPassword)
app.get('/auth/whoAmI', authenticate, checkWhoIs)
app.post('/auth/logout', authenticate, logOutUser)
app.post('/auth/changepassword', authenticate, changePasswordValidate, changePassword)

// quiz routes
app.get('/quiz', authenticate, getQuiz)
app.get('/quiz/:id', authenticate, getOneQuiz)
app.post('/quiz/add', authenticate, validateRole, addQuiz)
app.put('/quiz/:id', authenticate, validateRole, updateQuiz)
app.delete('/quiz/:id', authenticate, validateRole, deleteQuiz)
app.post('/quiz/addquestion/:id', authenticate, validateRole, addQuestion)
app.put('/quiz/editquestion/:id', authenticate, validateRole, editQuestion)
app.delete('/quiz/:quizId/deletequestion/:questionId', authenticate, validateRole, deleteQuestion)

// users routes
app.get('/user', authenticate, validateRole, getUsersData)
app.post('/user/addhistory', authenticate, addHistory)
app.get('/user/history', authenticate, getHistory)
app.get('/user/getscore', authenticate, getScore)

// contact routes
app.post("/contact", contactUs);

app.listen(PORT, () => {
    console.log(`Server is runing on port: ${PORT}`);
});