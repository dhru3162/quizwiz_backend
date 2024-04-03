const swaggerAutogen = require("swagger-autogen")();

require("dotenv").config();

const doc = {
  info: {
    title: "Backend",
    description: "Quiz based tasks management API",
  },
  host: "localhost:" + (process.env.PORT),
};

const outputFile = "./swagger_output.json";
const routes = ['./routes/*.js'];

swaggerAutogen(outputFile, routes, doc);