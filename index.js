require("dotenv").config();
const { databaseConnection } = require("./database");
const { serverStart } = require("./server");

databaseConnection
  .then(() => {
    serverStart();
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(`Database connection error: ${err.message}`);
    process.exit(1);
  });
