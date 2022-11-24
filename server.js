const app = require("./app");
const swaggerDocs = require("./swagger");
const errorMiddleware = require("./routes/api/errorMiddleware");
const { port } = require("./serverVariables");

const serverStart = () => errorMiddleware(app);
swaggerDocs(app);
app.listen(port, () => {
  console.log(`Server running. Use our API on port: ${port}`);
});

module.exports = { serverStart };
