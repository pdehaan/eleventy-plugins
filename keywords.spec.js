const inspect = require("node:util").inspect;

const data = require("./src/_data/keywords");

console.log(inspect(data, { sorted: true }));
