const fs = require('fs');
const path = require('path');

function generateSitemap() {
  const indexPath = path.resolve(__dirname, '../src/data/stotrams-index.json');
  const stotrams = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  const domain = 'https://stotramani.app';
  const currentDate = new Date().toISOString().split('T')[0];

  const staticRoutes = [
    { loc: `${domain}/`, priority: '1.0', changefreq: 'daily' },
    { loc: `${domain}/contact`, priority: '0.8', changefreq: 'monthly' },
    { loc: `${domain}/privacy`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${domain}/terms`, priority: '0.5', changefreq: 'monthly' },
    { loc: `${domain}/cookies`, priority: '0.5', changefreq: 'monthly' },
  ];

  // Dedicated Panchang Routes
  const panchangCities = ['hyderabad', 'vijayawada', 'visakhapatnam', 'tirupati', 'bengaluru', 'chennai'];
  const panchangRoutes = [
    { loc: `${domain}/panchang`, priority: '0.9', changefreq: 'daily' },
    ...panchangCities.map((city) => ({
      loc: `${domain}/panchang/${city}/${currentDate}`,
      priority: '0.9',
      changefreq: 'daily',
    })),
  ];

  // Canonical Stotram Routes ONLY (No duplicate /readings/ or /telugu/ URLs)
  const stotramRoutes = [];
  const seenCanonicalStotrams = new Set();

  for (const stotram of stotrams) {
    const slug = stotram.slug || stotram.id;
    const category = stotram.category || 'devotional';
    if (category && slug) {
      const canonicalKey = `${category}/${slug}`;
      if (!seenCanonicalStotrams.has(canonicalKey)) {
        seenCanonicalStotrams.add(canonicalKey);
        stotramRoutes.push({
          loc: `${domain}/${category}/${slug}`,
          priority: '0.9',
          changefreq: 'weekly',
        });
      }
    }
  }

  // Category Index Pages
  const uniqueCategories = Array.from(new Set(stotrams.map((s) => s.category).filter(Boolean)));
  const categoryListingRoutes = uniqueCategories.map((cat) => ({
    loc: `${domain}/${cat}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticRoutes, ...panchangRoutes, ...categoryListingRoutes, ...stotramRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  const outputPath = path.resolve(__dirname, '../public/sitemap.xml');
  fs.writeFileSync(outputPath, xml, 'utf8');
  console.log(`Successfully generated public/sitemap.xml with ${allUrls.length} canonical URLs`);
}

generateSitemap();
