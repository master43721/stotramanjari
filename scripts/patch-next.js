const fs = require("fs");
const path = require("path");

const target = path.join(__dirname, "..", "node_modules", "next", "dist", "build", "index.js");

if (fs.existsSync(target)) {
  let content = fs.readFileSync(target, "utf8");
  const needle = "async function writeFileUtf8(filePath, content) {\n    await _fs.promises.writeFile(filePath, content, 'utf-8');\n}";
  const replacement = "async function writeFileUtf8(filePath, content) {\n    await _fs.promises.mkdir(_path.default.dirname(filePath), { recursive: true });\n    await _fs.promises.writeFile(filePath, content, 'utf-8');\n}";

  if (content.includes(needle)) {
    content = content.replace(needle, replacement);
    fs.writeFileSync(target, content, "utf8");
    console.log("[patch-next] Successfully patched writeFileUtf8 in next/dist/build/index.js");
  } else if (content.includes("await _fs.promises.mkdir(_path.default.dirname(filePath), { recursive: true });")) {
    console.log("[patch-next] next/dist/build/index.js already patched");
  }
}

const fontFileTarget = path.join(__dirname, "..", "node_modules", "next", "dist", "compiled", "@next", "font", "dist", "google", "fetch-font-file.js");
if (fs.existsSync(fontFileTarget)) {
  let fontContent = fs.readFileSync(fontFileTarget, "utf8");
  const needle = "return Buffer.from(url);";
  const replacement = `const geistPath = require("path").resolve(__dirname, "../../../../../next-devtools/server/font/geist-latin.woff2");
        if (node_fs_1.default.existsSync(geistPath)) return node_fs_1.default.readFileSync(geistPath);
        return Buffer.from(url);`;
  if (!fontContent.includes("const geistPath =")) {
    if (fontContent.includes(needle)) {
      fontContent = fontContent.replace(needle, replacement);
      fs.writeFileSync(fontFileTarget, fontContent, "utf8");
      console.log("[patch-next] Successfully patched fetchFontFile in @next/font");
    }
  } else {
    console.log("[patch-next] fetchFontFile in @next/font already patched");
  }
}

