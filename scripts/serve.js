const http = require('http');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.join(__dirname, '..', 'out');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
};

function handleRequest(req, res) {
  let reqPath = req.url.split('?')[0];
  if (reqPath.startsWith('/stotramanjari')) {
    reqPath = reqPath.replace(/^\/stotramanjari/, '') || '/';
  }
  if (!reqPath || reqPath === '') reqPath = '/';
  
  let filePath = path.join(OUT_DIR, reqPath);
  
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  } else if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    const notFound = path.join(OUT_DIR, '_not-found.html');
    if (fs.existsSync(notFound)) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      fs.createReadStream(notFound).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  }
}

function startServer(port) {
  const server = http.createServer(handleRequest);
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Stotra Manjari Preview Server] Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[Stotra Manjari Preview Server] Server error:', err);
    }
  });
  server.listen(port, '0.0.0.0', () => {
    console.log(`[Stotra Manjari Preview Server] Serving out/ on http://localhost:${port}/stotramanjari/`);
  });
}

const startPort = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
startServer(startPort);
