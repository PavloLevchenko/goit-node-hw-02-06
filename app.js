const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./routes/api/users");
const contactsRouter = require("./routes/api/contacts");
const tryCatchWrapper = require("./routes/api/tryCatchWrapper");

const app = express();

const accessLogStream = fs.createWriteStream(
  path.resolve("logs", "request.log"),
  { flags: "a" }
);
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger, { stream: accessLogStream }));
app.use(logger("dev", formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/", express.static("public"));
app.use("/api/users", tryCatchWrapper(usersRouter));
app.use("/api/contacts", tryCatchWrapper(contactsRouter));

module.exports = app;
