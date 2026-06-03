const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const databasePath = path.join(dataDir, 'vignanam-data.json');
const mappingsPath = path.join(dataDir, 'category-mappings.json');

const database = JSON.parse(fs.readFileSync(databasePath, 'utf-8'));
const mappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf-8'));

const dbSlugs = new Set(database.map(s => s.slug || s.id));
const allUniqueSlugs = new Set();
const missingUniqueSlugs = new Set();

Object.keys(mappings).forEach(category => {
  mappings[category].forEach(slug => {
    allUniqueSlugs.add(slug);
    if (!dbSlugs.has(slug)) {
      missingUniqueSlugs.add(slug);
    }
  });
});

console.log(`Total database items: ${database.length}`);
console.log(`Total unique slugs in all 65 categories: ${allUniqueSlugs.size}`);
console.log(`Missing unique slugs in database: ${missingUniqueSlugs.size}`);
console.log(`Present unique slugs in database: ${allUniqueSlugs.size - missingUniqueSlugs.size}`);
