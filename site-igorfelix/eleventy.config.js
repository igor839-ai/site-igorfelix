module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "static": "/" });

  eleventyConfig.addFilter("readingTime", (content) => {
    const text = String(content || "").replace(/<[^>]+>/g, " ");
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });

  const meses = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  eleventyConfig.addFilter("dateBR", (d) => {
    const dt = (d instanceof Date) ? d : new Date(d);
    return `${dt.getUTCDate()} de ${meses[dt.getUTCMonth()]} de ${dt.getUTCFullYear()}`;
  });
  eleventyConfig.addFilter("isoDate", (d) => {
    const dt = (d instanceof Date) ? d : new Date(d);
    return dt.toISOString().slice(0,10);
  });

  eleventyConfig.addCollection("posts", (api) => {
    return api.getFilteredByGlob("src/blog/posts/*.md").sort((a,b) => b.date - a.date);
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk","md","html"]
  };
};
