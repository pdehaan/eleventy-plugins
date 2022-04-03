const plugins = require("./plugins.json");

const authors = Object.values(plugins).reduce(
  (acc = new Map(), plugin = {}) => {
    const key = plugin.package.publisher.username;
    const authorPlugins = acc.get(key) || [];
    authorPlugins.push(plugin.package.name);
    return acc.set(key, authorPlugins);
  },
  new Map()
);

const data = Object.fromEntries(authors.entries());

// TODO: Sort object by default?
module.exports = data;
