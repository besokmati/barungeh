module.exports = function(eleventyConfig) {

  // ========================================================
  // PASSTHROUGH FILES
  // ========================================================

  eleventyConfig.addPassthroughCopy({
    "src/assets": "assets"
  });

  eleventyConfig.addPassthroughCopy("admin");


  // ========================================================
  // CATEGORY SLUG
  // ========================================================

  const CATSLUG = {
    "horror": "horror",
    "horror riddle": "horror",
    "mystery": "mystery",
    "psychological": "psychological",
    "urban legend": "urbanlegend",
    "detective": "detective",
    "paranormal": "paranormal"
  };

  eleventyConfig.addFilter("catSlug", s =>
    CATSLUG[(s || "").toLowerCase()] || "lainnya"
  );


  // ========================================================
  // DIFFICULTY
  // ========================================================

  eleventyConfig.addFilter("diffTags", n => {
    n = Number(n) || 0;

    let t =
      n <= 2
        ? "mudah"
        : n === 3
        ? "sedang"
        : "sulit";

    return t + (n >= 5 ? " ngeh99" : "");
  });


  // ========================================================
  // UTILITY FILTERS
  // ========================================================

  eleventyConfig.addFilter("pad2", n =>
    String(n).padStart(2, "0")
  );

  eleventyConfig.addFilter("published", arr =>
    (arr || []).filter(i => i.data.published)
  );


  // ========================================================
  // DATE FILTERS
  // ========================================================

  eleventyConfig.addFilter("dateISO", d => {
    return (d instanceof Date ? d : new Date(d))
      .toISOString()
      .slice(0, 10);
  });

  eleventyConfig.addFilter("datetimeISO", d => {
    if (!d) return "";

    return (d instanceof Date ? d : new Date(d))
      .toISOString();
  });


  // ========================================================
  // ABSOLUTE URL
  // Dipakai untuk OG Image / Facebook / WhatsApp / SEO
  // ========================================================

  eleventyConfig.addFilter("absoluteUrl", url => {
    if (!url) return "";

    // Kalau sudah URL penuh, jangan diubah
    if (/^https?:\/\//i.test(url)) {
      return url;
    }

    const base = "https://barungeh.web.id";

    return base + (
      url.startsWith("/")
        ? url
        : "/" + url
    );
  });


  // ========================================================
  // COLLECTIONS
  // ========================================================

  eleventyConfig.addCollection("riddlePub", c =>
    c
      .getFilteredByTag("riddle")
      .filter(i => i.data.published)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("ceritaPub", c =>
    c
      .getFilteredByTag("cerita")
      .filter(i => i.data.published)
      .sort((a, b) => b.date - a.date)
  );


  // ========================================================
  // ELEVENTY CONFIG
  // ========================================================

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
};
