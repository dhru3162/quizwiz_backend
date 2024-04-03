const bodyParser = require('body-parser');
const express = require('express');
const userRoutes = require('./routes/users');
const quizRoutes = require('./routes/quiz');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require("./swagger_output.json");
const app = express();
require('dotenv').config();
require('./database/db');

const PORT = process.env.PORT || 8000;

app.use(express.static('public'));
app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/auth', userRoutes);
app.use('/quiz', quizRoutes);

app.listen(PORT, () => {
    console.log(`Server is runing on port: ${PORT}`);
})