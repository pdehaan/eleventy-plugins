import axios from "axios";
import slugify from "@11ty/eleventy/src/Filters/Slugify.js";

import config from "./.config.js";

try {
  let plugins = await searchByKeywords(config.keyword, config.ignoreKeywords);
  plugins = plugins.reduce((acc = {}, plugin = {}) => {
    acc[plugin.package.name] = plugin;
    return acc;
  }, {});
  console.log(JSON.stringify(plugins));
} catch (err) {
  console.error(err.message);
  process.exitCode = 1;
}

async function searchByKeywords(
  keywords = "",
  ignoreKeywords = [],
  size = 250,
  recursive = true
) {
  const _fetcher = async (res = []) => {
    const url = new URL("https://api.npms.io/v2/search");
    url.searchParams.append("q", `keywords:${keywords} not:deprecated`);
    url.searchParams.append("size", size);
    url.searchParams.append("from", res.length);

    const { data } = await axios.get(url.href);
    const results = data.results.map((plugin) => {
      if (plugin.package.scope === "unscoped") {
        plugin.package.scsope = "";
      }
      plugin.tags =
        plugin.package.keywords
          ?.map((keyword) => slugify(keyword))
          .filter(
            (keyword) =>
              ![...ignoreKeywords, plugin.package.scope].includes(keyword)
          ) || [];
      return plugin;
    });
    res.push(...results);
    if (recursive && res.length < data.total) {
      // Recursively fetch the next page...
      return _fetcher(res);
    }
    // Return the results.
    return res;
  };
  return _fetcher();
}
