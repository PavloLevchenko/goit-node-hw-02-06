const parameters = require("./parameters");
const shemes = require("./shemes");
const requestBodies = require("./requestBodies");

const { version } = require("../package.json");
const { port, adress } = require("../serverVariables");

const jsdocOptions = {
  failOnErrors: true,
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Phonebook REST API Specification",
      version,
      contact: {
        name: "Pavlo Levchenko",
        url: "https://github.com/PavloLevchenko",
      },
    },
    servers: [
      {
        url: `http://${adress}:${port}`,
        description: "API base URL",
      },
    ],
    components: {
      shemes,
      parameters,
      requestBodies,
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./routes/api/contacts.js",
    "./routes/api/users.js",
  ],
};

module.exports = jsdocOptions;
