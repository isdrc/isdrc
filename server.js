const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const server = http.createServer((req, res) => {
  const VISITORS_FILE = path.join(__dirname, 'visitors.json');
  // helper: increment visitor count and update countries; calls cb(state, country)
  function incrementVisit(req, cb) {
    fs.readFile(VISITORS_FILE, 'utf8', (err, data) => {
      let state = { count: 0, countries: {} };
      if (!err) {
        try { state = Object.assign(state, JSON.parse(data)); } catch (e) { /* ignore */ }
      }

      state.count = Number(state.count || 0) + 1;

      // determine IP address
      let ip = '';
      if (req.headers['x-forwarded-for']) ip = req.headers['x-forwarded-for'].split(',')[0].trim();
      if (!ip) ip = req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : '';
      if (ip && ip.startsWith('::ffff:')) ip = ip.split('::ffff:')[1];

      const finalize = (countryName) => {
        if (!countryName) countryName = 'Unknown';
        countryName = String(countryName).trim() || 'Unknown';
        state.countries[countryName] = (state.countries[countryName] || 0) + 1;

        fs.writeFile(VISITORS_FILE, JSON.stringify(state, null, 2), (writeErr) => {
          if (writeErr) {
            if (cb) cb(null, null, writeErr);
            return;
          }
          if (cb) cb(state, countryName);
        });
      };

      // treat localhost/private addresses as Local
      if (!ip || ip === '127.0.0.1' || ip === '::1' || ip === '::' || ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.')) {
        finalize('Local');
        return;
      }

      // Lookup country via public IP geolocation (ipapi.co)
      const lookupUrl = `https://ipapi.co/${ip}/country_name/`;
      https.get(lookupUrl, (geoRes) => {
        let body = '';
        geoRes.on('data', (chunk) => body += chunk);
        geoRes.on('end', () => {
          let country = (body || '').toString().trim();
          if (!country || country.toLowerCase().indexOf('error') !== -1) country = 'Unknown';
          finalize(country);
        });
      }).on('error', () => {
        finalize('Unknown');
      });
    });
  }

  // API endpoint for visitor counter
  if (req.url && req.url.startsWith('/api/visitors')) {
    if (req.method === 'GET') {
      // return current state without incrementing
      fs.readFile(VISITORS_FILE, 'utf8', (err, data) => {
        let state = { count: 0, countries: {} };
        if (!err) {
          try { state = Object.assign(state, JSON.parse(data)); } catch (e) { /* use defaults */ }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(state));
      });
      return;
    }
    if (req.method === 'POST') {
      // increment and return updated state
      incrementVisit(req, (state, country) => {
        if (!state) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Failed to update visitor count' }));
          return;
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ count: state.count, country: country, countries: state.countries }));
      });
      return;
    }
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  let filePath = path.join(__dirname, req.url === '/' ? 'members.html' : req.url);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - Not Found</h1>');
    } else {
      let contentType = 'text/html';
      if (filePath.endsWith('.css')) contentType = 'text/css';
      if (filePath.endsWith('.js')) contentType = 'application/javascript';
      if (filePath.endsWith('.json')) contentType = 'application/json';
      if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
      if (filePath.endsWith('.png')) contentType = 'image/png';
      // If serving the homepage (index.html), increment the visitor count server-side.
      if (contentType === 'text/html' && filePath.endsWith('index.html')) {
        // increment asynchronously; don't block serving the page
        try {
          incrementVisit(req, function(){});
        } catch (e) {
          // ignore
        }
      }

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  console.log(`Open http://localhost:${PORT}/members.html in your browser`);
});
