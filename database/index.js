const mongoose = require("mongoose");

const uriDb = process.env.DB_HOST;

const databaseConnection = mongoose.connect(uriDb);

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
  console.log("Database connection closed");
});

const contacts = require("./models/contacts");
const users = require("./models/users");

module.exports = {
  databaseConnection,
  ...contacts,
  ...users,
};
