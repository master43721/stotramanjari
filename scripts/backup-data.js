const fs = require('fs');
const path = require('path');

function backupData() {
  const root = path.resolve(__dirname, '..');
  const dataDir = path.join(root, 'src/data');
  const backupBaseDir = path.join(root, 'backups');

  if (!fs.existsSync(backupBaseDir)) {
    fs.mkdirSync(backupBaseDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotDir = path.join(backupBaseDir, `snapshot-${timestamp}`);
  fs.mkdirSync(snapshotDir, { recursive: true });

  const dataFiles = [
    'stotrams-index.json',
    'vignanam-data.json',
    'brihat-stotrams.json',
    'stotrams.json',
    'category-mappings.json',
    'categories-structure.json',
    'stotrams-scraped.json',
  ];

  let backedUpCount = 0;
  for (const file of dataFiles) {
    const src = path.join(dataDir, file);
    if (fs.existsSync(src)) {
      const dest = path.join(snapshotDir, file);
      fs.copyFileSync(src, dest);
      backedUpCount++;
    }
  }

  // Also maintain a 'latest' snapshot for immediate restore
  const latestDir = path.join(backupBaseDir, 'latest');
  if (!fs.existsSync(latestDir)) {
    fs.mkdirSync(latestDir, { recursive: true });
  }
  for (const file of dataFiles) {
    const src = path.join(dataDir, file);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, path.join(latestDir, file));
    }
  }

  console.log(`[Backup] Successfully backed up ${backedUpCount} datasets to ${path.relative(root, snapshotDir)} and backups/latest`);
}

backupData();
