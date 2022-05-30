require("express-async-errors");

const migrationsRun = require("./database/sqlite/migrations")

const AppError = require("./utils/AppError")

const express = require("express");
const routes = require("./routes"); // Não é necessário colocar o index.js pq por padrão quando não dizemos o nome do arquivo que queremos carregar de uma pasta, ele carrega o index.js

// executando banco de dados
migrationsRun();

const app = express();
app.use(express.json());

app.use(routes);

app.use(( error, request, response, next) => {
  // verificando se o erro foi no lado do cliente
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: "error",
      message: error.message
    });
  }

  console.error(error);

  // se não for um erro do cliente, sera um erro padrão
  return response.status(500).json({
    status: "error",
    message: "Internal server error"
  });

})

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`));

