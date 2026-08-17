module.exports = {
  layout: "layouts/post.njk",
  tags: "cerita",
  eleventyComputed: {
    permalink: data => data.published ? `/cerita/${data.page.fileSlug}/` : false
  }
};
