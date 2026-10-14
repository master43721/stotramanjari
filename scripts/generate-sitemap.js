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

  const stotramRoutes = [];
  const seenReadings = new Set();
  const seenCategories = new Set();

  for (const stotram of stotrams) {
    const slug = stotram.slug || stotram.id;
    if (slug && !seenReadings.has(slug)) {
      seenReadings.add(slug);
      stotramRoutes.push({
        loc: `${domain}/readings/${slug}`,
        priority: '0.9',
        changefreq: 'weekly',
      });
    }

    if (stotram.category && slug) {
      const catKey = `${stotram.category}/${slug}`;
      if (!seenCategories.has(catKey)) {
        seenCategories.add(catKey);
        stotramRoutes.push({
          loc: `${domain}/${stotram.category}/${slug}`,
          priority: '0.8',
          changefreq: 'weekly',
        });
      }
    }
  }

  const uniqueCategories = Array.from(new Set(stotrams.map((s) => s.category).filter(Boolean)));
  const categoryListingRoutes = uniqueCategories.map((cat) => ({
    loc: `${domain}/${cat}`,
    priority: '0.8',
    changefreq: 'weekly',
  }));

  const allUrls = [...staticRoutes, ...categoryListingRoutes, ...stotramRoutes];

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
  console.log(`Successfully generated public/sitemap.xml with ${allUrls.length} URLs`);
}

generateSitemap();
