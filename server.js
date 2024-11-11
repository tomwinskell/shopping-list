import { createServer } from 'http';
import fs from 'fs/promises';
import url from 'url';
import path from 'path';
const PORT = process.env.PORT;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = createServer( async (req, res) => {
  try {
    if (req.method === 'GET') {
      let filePath;
      if (req.url === '/') {
        filePath = path.join(__dirname, 'public', 'index.html');
      } else if (req.url === '/app.js') {
        filePath = path.join(__dirname, 'public', 'app.js');
      } else {
        res.writeHead(404, {'content-type': 'text/html'});
        res.end('<h1>Page not found</h1>');
        return;
      }
      const data = await fs.readFile(filePath);
      res.setHeader('content-type', 'text/html');
      res.write(data);
      res.end();
    } else {
      res.writeHead(403, {'content-type': 'text/html'});
      res.end('<h1>Request not allowed</h1>');
    }
  } catch (error) {
    console.log(error);
    throw new Error('There was an error');
  }
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})