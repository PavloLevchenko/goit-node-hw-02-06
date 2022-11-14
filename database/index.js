const mongoose = require("mongoose");

const uriDb = process.env.DB_HOST;

const connection = mongoose.connect(uriDb);

connection
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log(`Database connection error: ${err.message}`);
    process.exit(1);
  });

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    process.exit(0);
  });
  console.log("Database connection closed");
});

const contacts = require("./models/contacts");
const users = require("./models/users");

module.exports = {
  ...contacts,
  ...users,
};
