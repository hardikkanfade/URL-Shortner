import { readFile } from 'fs/promises';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 3002;

const server = createServer(async (req, res) => {
    if (req.method === 'GET') {
        // Resolve file path
        let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
        
        // Get file extension to determine content type
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        try {
            if (!existsSync(filePath)) throw new Error('File not found');

            const content = await readFile(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
        } catch (err) {
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`<h1>404 - File Not Found</h1><p>${err.message}</p>`);
        }
    } else {
        res.writeHead(405, { 'Content-Type': 'text/html' });
        res.end('<h1>405 - Method Not Allowed</h1>');
    }
});

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
