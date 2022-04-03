const _shuffle = require("lodash.shuffle");
const del = require("del").sync;
const pluralize = require("pluralize");

const config = require("./.config");
const _plugins = require("./src/_data/plugins.json");

module.exports = (eleventyConfig) => {
  del("www/");

  // Set a global layout file (relative to the ./src/_layouts/ folder).
  eleventyConfig.addGlobalData("layout", "base.liquid");
  eleventyConfig.addGlobalData("config", config);

  eleventyConfig.addFilter("to_fixed", function (value=0, precision=3) {
    return value.toFixed(precision);
  });

  eleventyConfig.addFilter("shuffle", function (arr=[]) {
    return _shuffle(arr);
  });
  eleventyConfig.addFilter("pluralize", function (word="", count=0, inclusive=true) {
    return pluralize(word, count, inclusive);
  });

  eleventyConfig.addFilter(
    "includes",
    function (arr = [], value = "", forceLowerCase = true) {
      if (forceLowerCase) {
        arr = arr.map((value) => value.toString().toLowerCase());
        value = value.toLowerCase();
      }
      return arr.includes(value);
    }
  );

  eleventyConfig.addFilter("date_format", function (date) {
    return new Intl.DateTimeFormat("en-US", { dateStyle: "long" }).format(
      new Date(date)
    );
  });

  eleventyConfig.addFilter("date_relative", function (date) {
    return eleventyConfig.DateTime.fromJSDate(new Date(date)).toRelative();
  });

  eleventyConfig.addFilter("keys", Object.keys);
  eleventyConfig.addFilter("values", Object.values);

  // NOTE: if we pass the global `plugins` data/array to the filter, we don't need to import the global data file above.
  eleventyConfig.addFilter("expand_plugins", function (arr = [], plugins = _plugins) {
    return arr.map(name => plugins[name]);
  });

  return {
    dir: {
      input: "src",
      output: "www",
      layouts: "_layouts",
    },
  };
};
