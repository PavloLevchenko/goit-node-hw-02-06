const adress = Object.values(require("os").networkInterfaces())
.flat()
.filter(({ family, internal }) => family === "IPv4" && !internal)
.map(({ address }) => address)[0];

const port = process.env.PORT;

module.exports = { port, adress };