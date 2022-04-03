const inspect = require("node:util").inspect;

const data = require("./src/_data/authors");

console.log(inspect(data, { sorted: true }));
