const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const jsdocOptions = require("./spec");
const {port, adress} = require("../serverVariables");

const endPoint = "/api-docs";

const openapiSpecification = swaggerJsdoc(jsdocOptions);

const swaggerOptions = {
  swaggerOptions: {
      operationsSorter: (a, b) => {
        const methodsOrder = ["get", "post", "put", "patch", "delete", "options", "trace"];
        let result = methodsOrder.indexOf(a.get("method")) - methodsOrder.indexOf(b.get("method"));

          if (result === 0) {
              result = a.get("path").localeCompare(b.get("path"));
          }

          return result;
      }
  }
};

const swaggerDocs = (app) => {
  app.get(endPoint + ".json", (req, res) => {
    res.json(openapiSpecification);
  });

  app.use(endPoint, swaggerUi.serve, swaggerUi.setup(openapiSpecification, swaggerOptions));

  console.log(`Docs available at http://${adress}:${port}${endPoint}`);
  console.log(
    `Download spec file at http://${adress}:${port}${endPoint + ".json"}`
  );
};

module.exports = swaggerDocs;
