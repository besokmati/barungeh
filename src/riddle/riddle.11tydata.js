module.exports = {
  layout: "layouts/post.njk",
  tags: "riddle",
  eleventyComputed: {
    // Draft (published:false) tidak dibuat jadi halaman publik, tapi tetap ada di CMS
    permalink: data => data.published ? `/riddle/${data.page.fileSlug}/` : false
  }
};
