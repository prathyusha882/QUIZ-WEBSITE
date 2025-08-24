// backend_django/server.js
const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'staticfiles' directory
app.use('/static', express.static(path.join(__dirname, 'staticfiles')));

// Proxy API requests to the Django backend
app.use(proxy('/api', { target: 'http://localhost:8000', changeOrigin: true }));

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});