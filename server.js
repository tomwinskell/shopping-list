import { createServer } from 'http';
import fs from 'fs/promises';
import url from 'url';
import path from 'path';
import qs from 'querystring';
import Handlebars from 'handlebars';
const PORT = process.env.PORT;

const items = ['pineapple', 'apple', 'bread'];

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// route handler for 'post' and 'delete'
const handleItem = (req, res, callback) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  })
  req.on('end', () => {
    const data = JSON.parse(body)
    callback(data);
    res.end();
  })
};

// Route handler for 'get'
const displayList = async (req, res) => {
  const filePath = path.join(__dirname, 'views', 'template.hbs');
  const data = await fs.readFile(filePath);
  const source = data.toString();
  const template = Handlebars.compile(source);
  const output = template(items);
  res.setHeader('content-type', 'text/html');
  res.write(output);
  res.end();
}

// Handle static files
const staticFileHandler = async (req, res, url) => {
  const filePath = path.join(__dirname, url);
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
  };
  const extname = String(path.extname(url)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  const data = await fs.readFile(filePath);
  res.writeHead(200, {'content-type': contentType});
  res.end(data)
};

const server = createServer( async (req, res) => {
  try {
    const pattern = '^\/public\/[a-zA-Z]+.[a-zA-Z]+';
    const { url } = req;

    if (url === '/') {
      if (req.method === 'GET') {
        displayList(req, res);
      } else if (req.method === 'POST') {
        // handle JSON then add to array
        handleItem(req, res, (data) => {
          items.push(data);
        });
      } else if (req.method === 'DELETE') {
        // handle JSON then delete from array
        handleItem(req, res, (data) => {
          const index = items.indexOf(data);
          items.splice(index, 1);
        });
      } else {
        res.writeHead(403, {'content-type': 'text/html'});
        res.end('<h1>Request not allowed</h1>');
        return;
      }
    } else if (url.match(pattern)) {
      staticFileHandler(req, res, url);
    } else {
      res.writeHead(404, {'content-type': 'text/html'});
      res.end('<h1>Page not found</h1>');
      return;
    }
  } catch (error) {
    console.log(error);
    throw new Error('There was an error');
  }
})

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})