const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compressAll() {
  const root = path.resolve(__dirname, '..');
  const images = [
    { file: path.join(root, 'public/app-icon.jpg'), type: 'jpeg', opts: { quality: 82, mozjpeg: true } },
    { file: path.join(root, 'public/og-image.jpg'), type: 'jpeg', opts: { quality: 82, mozjpeg: true } },
    { file: path.join(root, 'public/og-image.png'), type: 'png', opts: { compressionLevel: 9, quality: 80, effort: 10 } },
    { file: path.join(root, 'public/icon-512.png'), type: 'png', opts: { compressionLevel: 9, quality: 80, effort: 10 } },
    { file: path.join(root, 'public/icon-192.png'), type: 'png', opts: { compressionLevel: 9, quality: 80, effort: 10 } },
    { file: path.join(root, 'public/apple-touch-icon.png'), type: 'png', opts: { compressionLevel: 9, quality: 80, effort: 10 } },
  ];

  for (const img of images) {
    if (!fs.existsSync(img.file)) continue;
    const before = fs.statSync(img.file).size;
    let pipeline = sharp(img.file);
    if (img.type === 'jpeg') {
      pipeline = pipeline.jpeg(img.opts);
    } else if (img.type === 'png') {
      pipeline = pipeline.png(img.opts);
    }
    const buffer = await pipeline.toBuffer();
    fs.writeFileSync(img.file, buffer);
    const after = fs.statSync(img.file).size;
    const saving = (((before - after) / before) * 100).toFixed(1);
    console.log(`${path.basename(img.file)}: ${before}B -> ${after}B (${saving}% saved)`);
  }
}

compressAll().catch((err) => {
  console.error('Compression failed:', err);
  process.exit(1);
});
