# eleventy-plugins

## WHY?
Because I wanted to see a list of all packages in npm with the "eleventy-plugin" keyword.

## HOW?
Run the fetch_data.mjs file to [recursively] search npms.io's API for non-deprecated packages with the specified keyword, do some light data transforms, and then write the big-ol' JSON blob out to stdout. Then we just pipe that output into an Eleventy global data file in ./src/_data directory.
The ./src/_data/ directory also has to other files, authors.js and keywords.js, which both import the generated "plugins.json" file from our fetch_data.mjs script and does some `.reduce()` magic to create objects with authors+package names and keywords+package names.
Although, one potential future optimization could be generating a more static ./src/_data/authors.json and ./src/_data/keywords.json file from the fetch_data.mjs file and writing all three JSON blobs directly to the ./src/_data/ directory.

If you want to change which keywords are searched and filtered, you can edit the .config.js file and it's `keyword` and `ignoreKeywords` properties.

Since recursively fetching data from a third-party API can be slow and/or costly, the data isn't fetched on each build, but instead seeded using our <kbd>npm run fetch_data</kbd> script which fetches the data and pipes the output to ./src/_data/plugins.json. If you want to refresh the data, you need to run <kbd>npm run fetch_data</kbd>. Or this could potentially be refactored to use something like https://www.npmjs.com/package/@11ty/eleventy-fetch to automatically fetch and cache the results.

## TESTING
Since it can be difficult to visualize the output from the ./src/_data/authors.js and ./src/_data/keywords.js files, you can run the <kbd>npm run test:authors</kbd> and <kbd>npm run test:keywords</kbd> npm scripts which will output the computed data to stdout. 🤷

## NOTES
- The site uses Eleventy 2.0 (canary, pre-alpha build). It probably works w/ Eleventy 1.x as well.
- The global layout is set in the .eleventy.js file using `eleventyConfig.addGlobalData("layout", "base.liquid")` because it's clever and avoided a global data file or directory data files. But also means it isn't backwards compatible w/ 0.12.x.
- The previously mentioned .config.js file is also added as global data using `eleventyConfig.addGlobalData("config", require("./.config"))` which means our search keywords and keyword ignores will be available globally to our templates.
- The src/index.liquid template displays a list of all matching plugins sorted by the `score.final` property from npms.io API. If you switch to using npm's API directly, that faux-score won't exist and you'll have to tweak accordingly.
- We use `eleventyComputed` to set titles since we inject the `{{ config.keyword }}` from the root .config.js file. This means if you wanted to change the search keyword from "eleventy-plugin" to "markdown-it-plugin", you shouldn't need to modify any templates and the titles/labels should update automatically.
- We use the new Liquid [`{% render %}`](https://liquidjs.com/tags/render.html) tag instead of the deprecated [`{% include %}`](https://liquidjs.com/tags/include.html) tag, so if your src/_includes/plugin.liquid include file needs additional variables, you will need to explicitly specify them in the calling template.
- Authors on the /authors/index.html page are displayed in a shuffled/random order for each build. If you refresh the page, the order will be the same, but each time the site is built the order will be randomized.
- Author detail pages will display the author's npm username, number of plugins, and plugin details using the fancy [`for`](https://liquidjs.com/tags/render.html#The-for-Parameter) parameter of the `{% render %}` tag which loops over an array and calls the render tag for each item, passing the current item as the context.
