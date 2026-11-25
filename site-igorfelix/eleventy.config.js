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

  // Link do WhatsApp com mensagem pronta (o GTM conta o clique em links com "wa.me")
  eleventyConfig.addFilter("waLink", (text) => {
    const base = "https://wa.me/5511971694420";
    return text ? base + "?text=" + encodeURIComponent(String(text)) : base;
  });

  // "/aposentadoria/por-idade.html" -> "/aposentadoria/por-idade" (o Cloudflare serve sem .html)
  eleventyConfig.addFilter("prettyUrl", (url) => {
    let u = String(url || "/");
    u = u.replace(/index\.html$/, "");
    u = u.replace(/\.html$/, "");
    return u || "/";
  });

  // Ícones em traço, no padrão visual do site
  const ICONS = {
    check: '<path d="M5 13l4 4L19 7"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    alert: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4M12 17.5v.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    docCheck: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 15l2 2 4-4"/>',
    docX: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9.5 12.5l5 5M14.5 12.5l-5 5"/>',
    list: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
    calc: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M8 6h8M8 11h2M12 11h2M16 11v.01M8 15h2M12 15h2M16 15v3M8 18.5h2M12 18.5h2"/>',
    users: '<path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M21 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    star: '<path d="M12 2l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 14.3 7.2 16.9l.9-5.4L4.2 7.7l5.4-.8L12 2z"/>',
    scale: '<path d="M12 3v18M5 7l7-4 7 4M4 7h16M6 7v5a6 6 0 0 0 12 0V7"/>',
    gavel: '<path d="M14 4l6 6M11 7l6 6M9 9l6 6-3 3-6-6zM4 20l6-6"/>',
    shield: '<path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z"/><path d="M9 12l2 2 4-4"/>',
    hat: '<path d="M3 18h18v2.2H3z"/><path d="M5 18v-2.5a7 7 0 0 1 14 0V18"/><path d="M10 9V6.2h4V9"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    access: '<circle cx="12" cy="4.5" r="2"/><path d="M5 8.5l7 1.5 7-1.5M12 10v5l-3.5 6M12 15l3.5 6"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/>',
    route: '<circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h8a3 3 0 0 0 0-6H8a3 3 0 0 1 0-6h8"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    pin: '<path d="M12 21s-7-5.1-7-11a7 7 0 0 1 14 0c0 5.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z"/>',
    money: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.8"/><path d="M6 10v4M18 10v4"/>',
    wallet: '<rect x="2" y="7" width="20" height="13" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 12h20"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    building: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2 21h20M8 7h4M8 11h4M8 15h4"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.6-4.5L3 9M4 13a8 8 0 0 0 14.6 4.5L21 15"/><path d="M3 4v5h5M21 20v-5h-5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    phone: '<path d="M21 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 4.2 2 2 0 0 1 3.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L7 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z"/><circle cx="12" cy="12" r="3"/>',
    ear: '<path d="M6 8.5a6 6 0 1 1 12 0c0 3.5-3 4.5-3 7.5a3.5 3.5 0 0 1-6.5 1.8"/><path d="M9 9a3 3 0 0 1 6 0c0 1.4-1 2-1.6 2.6"/>',
    hourglass: '<path d="M6 2h12M6 22h12M7 2v4a5 5 0 0 0 5 6 5 5 0 0 0 5-6V2M7 22v-4a5 5 0 0 1 5-6 5 5 0 0 1 5 6v4"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>'
  };
  eleventyConfig.addShortcode("icon", (name, cls) => {
    const p = ICONS[name] || ICONS.check;
    return `<svg class="ico${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  });
  eleventyConfig.addShortcode("waIcon", (cls) => {
    return `<svg class="wa-ico${cls ? " " + cls : ""}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.4-.7-2.9-1.2-4.7-4.1-4.9-4.3-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5s.8 1.9.8 2c.1.1.1.3 0 .5l-.3.5-.4.4c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.4 0 .1 0 .7-.2 1.2z"/></svg>`;
  });

  eleventyConfig.addCollection("posts", (api) => {
    return api.getFilteredByGlob("src/blog/posts/*.md").sort((a,b) => b.date - a.date);
  });

  // Páginas institucionais que entram no sitemap (front matter "sitemap")
  eleventyConfig.addCollection("paginas", (api) => {
    return api.getAll()
      .filter((p) => p.data && p.data.sitemap)
      .sort((a, b) => (b.data.sitemap.priority || 0) - (a.data.sitemap.priority || 0));
  });

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    templateFormats: ["njk","md","html"]
  };
};
