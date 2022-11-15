const app = require("./app");
const port = process.env.PORT;

const serverStart = () =>
  app.listen(port, () => {
    console.log(`Server running. Use our API on port: ${port}`);
  });

module.exports = serverStart;
