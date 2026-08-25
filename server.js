/**
 * TM Fashion House — Local HTTP Server & API
 * Zero-dependency Node.js server
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    let pathname = parsedUrl.pathname;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (pathname.startsWith('/api/')) {
        res.setHeader('Content-Type', 'application/json');
        
        if (pathname === '/api/health') {
            res.writeHead(200);
            res.end(JSON.stringify({ status: 'ok', brand: 'TM Fashion House', serverTime: new Date().toISOString() }));
            return;
        }

        if (pathname === '/api/info') {
            const data = require('./js/data.js');
            res.writeHead(200);
            res.end(JSON.stringify({
                designer: data.INITIAL_DESIGNER_PROFILE,
                productsCount: data.INITIAL_PRODUCTS.length,
                lookbookCount: data.LOOKBOOK_ITEMS.length,
                bespokeServices: data.BESPOKE_SERVICES
            }));
            return;
        }

        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
        return;
    }

    if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
    }

    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <div style="font-family: serif; text-align: center; padding: 4rem;">
                    <h1>404 — Outfit Not Found</h1>
                    <p>The requested page or resource could not be found at TM Fashion House.</p>
                    <a href="/" style="color: #c5a880; text-decoration: none; font-weight: bold;">Return to Storefront &rarr;</a>
                </div>
            `);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.listen(PORT, () => {
    console.log(`👑 TM FASHION HOUSE & E-COMMERCE IS LIVE! 👑`);
    console.log(`📍 Local Server: http://localhost:${PORT}`);
    console.log(`👗 Ready-to-Wear Wares, Bespoke Tailoring & Designer Portal Active.`);
});
