// const bodyParser = require('body-parser');
const express = require('express');
const auth = require('./routes/auth');
const quiz = require('./routes/quiz');
const user = require('./routes/user');
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require("./swagger_output.json");
var cors = require('cors')
const app = express();
require('dotenv').config();
require('./database/db');

const PORT = process.env.PORT || 8000;

app.use(express.static('public'));
app.use(cors())
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/auth', auth);
app.use('/quiz', quiz);
app.use('/user', user)

app.listen(PORT, () => {
    console.log(`Server is runing on port: ${PORT}`);
});