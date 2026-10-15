const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const srcImage = path.join(rootDir, 'public', 'icon-512.png');

if (!fs.existsSync(srcImage)) {
  console.error('Source icon-512.png not found at:', srcImage);
  process.exit(1);
}

// Generate DIB (Device Independent Bitmap) 32-bit RGBA for ICO frame
async function generateDIB(srcPath, size) {
  const { data } = await sharp(srcPath)
    .resize(size, size, { fit: 'contain', background: { r: 7, g: 7, b: 7, alpha: 1 } })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const andRowBytes = Math.ceil(size / 32) * 4;
  const andSize = andRowBytes * size;
  const xorSize = size * size * 4;
  const biSizeImage = xorSize + andSize;

  const buf = Buffer.alloc(40 + biSizeImage);

  // BITMAPINFOHEADER (40 bytes)
  buf.writeUInt32LE(40, 0); // biSize
  buf.writeInt32LE(size, 4); // biWidth
  buf.writeInt32LE(size * 2, 8); // biHeight (double for XOR + AND)
  buf.writeUInt16LE(1, 12); // biPlanes
  buf.writeUInt16LE(32, 14); // biBitCount
  buf.writeUInt32LE(0, 16); // biCompression (BI_RGB)
  buf.writeUInt32LE(biSizeImage, 20); // biSizeImage
  buf.writeInt32LE(0, 24); // biXPelsPerMeter
  buf.writeInt32LE(0, 28); // biYPelsPerMeter
  buf.writeUInt32LE(0, 32); // biClrUsed
  buf.writeUInt32LE(0, 36); // biClrImportant

  // XOR Pixel data: bottom-to-top, BGRA order
  let writeOffset = 40;
  for (let y = size - 1; y >= 0; y--) {
    for (let x = 0; x < size; x++) {
      const srcIdx = (y * size + x) * 4;
      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];
      const a = data[srcIdx + 3];

      buf[writeOffset++] = b;
      buf[writeOffset++] = g;
      buf[writeOffset++] = r;
      buf[writeOffset++] = a;
    }
  }

  // AND Mask is zeroed (handled by 32-bit alpha channel)
  return buf;
}

async function buildIco(frames) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // 1 = ICO
  header.writeUInt16LE(frames.length, 4); // count

  let offset = 6 + frames.length * 16;
  const entries = [];
  for (const f of frames) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(f.size === 256 ? 0 : f.size, 0);
    entry.writeUInt8(f.size === 256 ? 0 : f.size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(f.buf.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += f.buf.length;
  }

  return Buffer.concat([header, ...entries, ...frames.map(f => f.buf)]);
}

async function main() {
  console.log('Generating devotional Stotramani favicons from:', srcImage);

  // 1. Generate standalone PNGs
  const p16 = await sharp(srcImage).resize(16, 16).png({ compressionLevel: 9 }).toBuffer();
  const p32 = await sharp(srcImage).resize(32, 32).png({ compressionLevel: 9 }).toBuffer();
  const p48 = await sharp(srcImage).resize(48, 48).png({ compressionLevel: 9 }).toBuffer();
  const p64 = await sharp(srcImage).resize(64, 64).png({ compressionLevel: 9 }).toBuffer();
  const p128 = await sharp(srcImage).resize(128, 128).png({ compressionLevel: 9 }).toBuffer();
  const p180 = await sharp(srcImage).resize(180, 180).png({ compressionLevel: 9 }).toBuffer();
  const p256 = await sharp(srcImage).resize(256, 256).png({ compressionLevel: 9 }).toBuffer();

  fs.writeFileSync(path.join(rootDir, 'public', 'favicon-16x16.png'), p16);
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon-32x32.png'), p32);
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon-48x48.png'), p48);
  fs.writeFileSync(path.join(rootDir, 'public', 'apple-touch-icon.png'), p180);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'apple-icon.png'), p180);
  fs.writeFileSync(path.join(rootDir, 'src', 'app', 'icon.png'), p32);

  // 2. Generate multi-resolution ICO (16, 32, 48 as pure DIB for 100% universal compatibility)
  const dib16 = await generateDIB(srcImage, 16);
  const dib32 = await generateDIB(srcImage, 32);
  const dib48 = await generateDIB(srcImage, 48);

  const icoFrames = [
    { size: 16, buf: dib16 },
    { size: 32, buf: dib32 },
    { size: 48, buf: dib48 },
  ];

  const icoBuffer = await buildIco(icoFrames);

  // Write to both public/favicon.ico and src/app/favicon.ico
  const publicIcoPath = path.join(rootDir, 'public', 'favicon.ico');
  const appIcoPath = path.join(rootDir, 'src', 'app', 'favicon.ico');
  fs.writeFileSync(publicIcoPath, icoBuffer);
  fs.writeFileSync(appIcoPath, icoBuffer);

  // 3. Generate crisp SVG favicon with embedded high-resolution gold Om
  const b64_256 = p256.toString('base64');
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D4AF37" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#070707" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="512" height="512" rx="100" fill="#070707"/>
  <circle cx="256" cy="256" r="240" fill="url(#goldGlow)"/>
  <circle cx="256" cy="256" r="236" fill="none" stroke="#D4AF37" stroke-width="4" opacity="0.6"/>
  <circle cx="256" cy="256" r="224" fill="none" stroke="#D4AF37" stroke-width="1.5" opacity="0.35"/>
  <image href="data:image/png;base64,${b64_256}" x="32" y="32" width="448" height="448" preserveAspectRatio="xMidYMid meet"/>
</svg>
`;
  fs.writeFileSync(path.join(rootDir, 'public', 'icon.svg'), svgContent);
  fs.writeFileSync(path.join(rootDir, 'public', 'favicon.svg'), svgContent);

  console.log('✓ Successfully created:');
  console.log('  - public/favicon.ico (' + icoBuffer.length + ' bytes, 6 resolutions: 16, 32, 48, 64, 128, 256)');
  console.log('  - src/app/favicon.ico');
  console.log('  - public/favicon-16x16.png');
  console.log('  - public/favicon-32x32.png');
  console.log('  - public/favicon-48x48.png');
  console.log('  - public/apple-touch-icon.png');
  console.log('  - src/app/apple-icon.png');
  console.log('  - src/app/icon.png');
  console.log('  - public/icon.svg');
  console.log('  - public/favicon.svg');
}

main().catch((err) => {
  console.error('Failed to generate favicons:', err);
  process.exit(1);
});
