const plugins = require("./plugins.json");

const keywords = Object.values(plugins).reduce(
  (acc = new Map(), plugin = {}) => {
    for (const keyword of plugin.tags || []) {
      const pluginNames = acc.get(keyword) || [];
      pluginNames.push(plugin.package.name);
      acc.set(keyword, pluginNames);
    }
    return acc;
  },
  new Map()
);

const data = Object.fromEntries(keywords.entries());

// TODO: Sort object by default?
module.exports = data;
