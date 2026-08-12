const sitemap = require("@quasibit/eleventy-plugin-sitemap");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: "https://regalheights.co.uk",
    },
  });

  // Use Object Syntax to map source files directly to the root of the output folder
  eleventyConfig.addPassthroughCopy({
    "src/**/*.jpeg": "/",
    "src/**/*.jpg": "/",
    "src/**/*.png": "/",
    "src/**/*.ico": "/",
    "src/**/*.webp": "/",
    "src/robots.txt": "/robots.txt"
  });

  // Create a collection of posts that are published today or in the past
  eleventyConfig.addCollection("publishedPosts", function(collectionApi) {
    const now = new Date();
    return collectionApi.getFilteredByGlob("src/posts/*.md").filter(post => {
      return post.date <= now;
    }).reverse(); 
  });

  eleventyConfig.addFilter("filterByCategory", function(posts, category) {
    return (posts || []).filter(post => post.data && post.data.category === category);
  });

  eleventyConfig.addFilter("excludePost", function(posts, url) {
    return (posts || []).filter(post => post.url !== url);
  });

  eleventyConfig.addFilter("limit", function(arr, limit) {
    return (arr || []).slice(0, limit);
  });

  return {
    dir: {
      input: "src",
      output: "_site"
    },
    htmlTemplateEngine: "njk"
  };
};