import path from "node:path";
import Image from "@11ty/eleventy-img";
import markdownIt from "markdown-it";

const md = markdownIt({ html: false, linkify: true });

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy({ "src/assets/img/favicon.svg": "favicon.svg" });

  // CMS collections (src/content/*), see SPEC.MD §6
  eleventyConfig.addCollection("portfolio", (api) =>
    api.getFilteredByGlob("src/content/portfolio/*.md").sort((a, b) => b.date - a.date)
  );
  eleventyConfig.addCollection("testimonials", (api) =>
    api.getFilteredByGlob("src/content/testimonials/*.md")
  );
  eleventyConfig.addCollection("faq", (api) =>
    api.getFilteredByGlob("src/content/faq/*.md").sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99))
  );

  eleventyConfig.addFilter("head", (items, n) => items.slice(0, n));
  eleventyConfig.addFilter("featured", (items) => items.filter((item) => item.data.featured));
  eleventyConfig.addFilter("md", (text) => (text ? md.render(String(text)) : ""));
  eleventyConfig.addFilter("isoDate", (date) => new Date(date).toISOString().slice(0, 10));
  eleventyConfig.addFilter("unique", (items, key) => [...new Set(items.map((item) => item.data[key]).filter(Boolean))]);
  eleventyConfig.addFilter("initials", (name = "") =>
    name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase()
  );
  eleventyConfig.addFilter("nextItem", (items, url) => {
    const index = items.findIndex((item) => item.url === url);
    return items.length > 1 ? items[(index + 1) % items.length] : null;
  });
  eleventyConfig.addFilter("findBySlug", (items, slug) => items.find((item) => item.fileSlug === slug));

  // Responsive AVIF/WebP for raster images; SVGs pass through untouched
  eleventyConfig.addAsyncShortcode("image", async (src, alt, sizes = "100vw", loading = "lazy", className = "") => {
    const metadata = await Image(path.join("src", src), {
      widths: [480, 960, 1440, 2400],
      formats: ["avif", "webp", "svg"],
      svgShortCircuit: true,
      outputDir: "_site/assets/img/out/",
      urlPath: "/assets/img/out/",
      // Keep the keyword-friendly source name in the output (e.g. webbdesigner-karlstad-navlo-960.avif)
      filenameFormat: (id, src, width, format) => `${path.parse(src).name}-${id.slice(0, 6)}-${width}.${format}`,
    });
    return Image.generateHTML(metadata, {
      alt,
      sizes,
      loading,
      decoding: "async",
      ...(loading === "eager" && { fetchpriority: "high" }),
      ...(className && { class: className }),
    });
  });

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
