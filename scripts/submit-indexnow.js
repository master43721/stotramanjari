const https = require('https');

const HOST = 'stotramani.app';
const KEY = process.env.INDEXNOW_KEY || '4b8f7e2a1c9d0e3f5a6b7c8d9e0f1a2b';

async function submitIndexNow() {
  const payload = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: [
      `https://${HOST}/`,
      `https://${HOST}/panchang`,
      `https://${HOST}/panchang/hyderabad`,
      `https://${HOST}/panchang/vijayawada`,
      `https://${HOST}/panchang/visakhapatnam`,
      `https://${HOST}/panchang/tirupati`,
      `https://${HOST}/panchang/bengaluru`,
      `https://${HOST}/panchang/chennai`,
    ],
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/indexnow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': Buffer.byteLength(payload),
    },
  };

  const req = https.request(options, (res) => {
    console.log(`IndexNow status response code: ${res.statusCode}`);
    res.on('data', (d) => process.stdout.write(d));
  });

  req.on('error', (e) => {
    console.error('IndexNow submission error:', e);
  });

  req.write(payload);
  req.end();
}

submitIndexNow();
