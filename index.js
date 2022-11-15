require("dotenv").config();
const { databaseConnection } = require("./database");
const serverStart = require("./server");

databaseConnection
  .then(() => {
    console.log("Database connection successful");
    serverStart();
  })
  .catch((err) => {
    console.log(`Database connection error: ${err.message}`);
    process.exit(1);
  });
  