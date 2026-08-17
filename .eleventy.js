module.exports = function(eleventyConfig){
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy({ "src/_netlify/form-detect.html": "form-detect.html" });

  const CATSLUG = {
    "horror":"horror","horror riddle":"horror","mystery":"mystery",
    "psychological":"psychological","urban legend":"urbanlegend",
    "detective":"detective","paranormal":"paranormal"
  };
  eleventyConfig.addFilter("catSlug", s => CATSLUG[(s||"").toLowerCase()] || "lainnya");
  eleventyConfig.addFilter("diffTags", n => {
    n = Number(n)||0;
    let t = n<=2 ? "mudah" : n===3 ? "sedang" : "sulit";
    return t + (n>=5 ? " ngeh99" : "");
  });
  eleventyConfig.addFilter("pad2", n => String(n).padStart(2,"0"));
  eleventyConfig.addFilter("published", arr => (arr||[]).filter(i => i.data.published));
  eleventyConfig.addFilter("dateISO", d => (d instanceof Date ? d : new Date(d)).toISOString().slice(0,10));

  eleventyConfig.addCollection("riddlePub", c =>
    c.getFilteredByTag("riddle").filter(i=>i.data.published).sort((a,b)=>b.date-a.date));
  eleventyConfig.addCollection("ceritaPub", c =>
    c.getFilteredByTag("cerita").filter(i=>i.data.published).sort((a,b)=>b.date-a.date));

  return { dir: { input:"src", includes:"_includes", data:"_data", output:"_site" },
           markdownTemplateEngine:"njk", htmlTemplateEngine:"njk" };
};
