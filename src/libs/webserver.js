const express = require('express');
const http2express = require('http2-express-bridge');

const fs = require('fs');
const Common = require('./common.js').Common;

class WebServer {
 constructor() {
  var cert_priv = Common.settings.https_cert_path + 'privkey.pem';
  var cert_pub = Common.settings.https_cert_path + 'cert.pem';
  var cert_chain = Common.settings.https_cert_path + 'chain.pem';
  var certs_exist = false;
  if (fs.existsSync(cert_priv) && fs.existsSync(cert_pub) && fs.existsSync(cert_chain)) certs_exist = true;
  if (certs_exist) {
   const app = http2express(express);
   app.use((req, res, next) => {
    if (!req.secure) return res.redirect(301, 'https://' + req.headers.host + ':' + Common.settings.https_port + req.url);
    next();
   });
   app.use('/', Common.settings.web_path);
   app.use('*', express.static('www/notfound'));
   this.http = http.createServer(app).listen(Common.settings.http_port);
   Common.addLog('HTTP server running on port: ' + Common.settings.http_port);
   this.https = https.createSecureServer({ key: fs.readFileSync(cert_priv), cert: fs.readFileSync(cert_pub), ca: fs.readFileSync(cert_chain), allowHTTP1: true }, app).listen(Common.settings.https_port);
   Common.addLog('HTTPS server running on port: ' + Common.settings.https_port);
  } else {
   Common.addLog('Error: HTTPS server failed to start due to missing certificate files in ' + Common.settings.https_cert_path);
   process.exit(1);
  }
 };
}

module.exports = WebServer;
