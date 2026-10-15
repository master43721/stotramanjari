const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcImage = path.join(rootDir, 'public', 'icon-512.png');

if (!fs.existsSync(srcImage)) {
  console.error('Source icon-512.png not found at:', srcImage);
  process.exit(1);
}

async function generateLogos() {
  console.log('Generating Stotramani sacred gold logo assets from:', srcImage);

  const cx = 256, cy = 256;
  const radius = 195;
  const pad = 1;
  const halfDim = radius + pad;
  const dim = halfDim * 2; // 392x392

  // 1. Generate anti-aliased circular mask
  const maskSvg = Buffer.from(`
    <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <circle cx="256" cy="256" r="${radius}" fill="white" />
    </svg>
  `);

  const maskBuffer = await sharp(maskSvg).png().toBuffer();
  const baseImage = await sharp(srcImage).ensureAlpha().toBuffer();

  // Composite circular mask to create transparent background outside the golden rim
  const maskedBuffer = await sharp(baseImage)
    .composite([{ input: maskBuffer, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const left = cx - halfDim;
  const top = cy - halfDim;

  // Extract clean 392x392 transparent medallion
  const masterMedallion = await sharp(maskedBuffer)
    .extract({ left, top, width: dim, height: dim })
    .png({ compressionLevel: 9 })
    .toBuffer();

  // 2. Write master logo.png and logo.webp
  const logoPngPath = path.join(rootDir, 'public', 'logo.png');
  const logoWebpPath = path.join(rootDir, 'public', 'logo.webp');
  fs.writeFileSync(logoPngPath, masterMedallion);
  console.log('Created:', logoPngPath, `(${masterMedallion.length} bytes)`);

  const masterWebp = await sharp(masterMedallion).webp({ quality: 95, effort: 6 }).toBuffer();
  fs.writeFileSync(logoWebpPath, masterWebp);
  console.log('Created:', logoWebpPath, `(${masterWebp.length} bytes)`);

  // 3. Multi-resolution versions
  const sizes = [
    { name: 'logo-32.png', size: 32 },
    { name: 'logo-64.png', size: 64 },
    { name: 'logo-192.png', size: 192 },
    { name: 'logo-512.png', size: 512 },
  ];

  for (const s of sizes) {
    const resized = await sharp(masterMedallion)
      .resize(s.size, s.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toBuffer();
    const outPath = path.join(rootDir, 'public', s.name);
    fs.writeFileSync(outPath, resized);
    console.log('Created:', outPath, `(${resized.length} bytes)`);
  }

  // 4. SVG version wrapping high-resolution transparent medallion
  const base64Png = masterMedallion.toString('base64');
  const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${dim} ${dim}" width="${dim}" height="${dim}">
  <title>Stotramani Sacred Om Logo</title>
  <image href="data:image/png;base64,${base64Png}" width="${dim}" height="${dim}" />
</svg>
`;
  const logoSvgPath = path.join(rootDir, 'public', 'logo.svg');
  fs.writeFileSync(logoSvgPath, logoSvg);
  console.log('Created:', logoSvgPath);

  console.log('All Stotramani logo assets successfully generated!');
}

generateLogos().catch(err => {
  console.error('Error generating logo assets:', err);
  process.exit(1);
});
