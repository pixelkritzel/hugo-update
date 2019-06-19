const http = require('http');
const shelljs = require('shelljs');

const config = require('./.config');

var createHandler = require('github-webhook-handler');

var handler = createHandler({ path: config.path, secret: config.secret });

http
  .createServer(function(req, res) {
    handler(req, res, function(err) {
      res.statusCode = 404;
      res.end('no such location');
    });
  })
  .listen(config.port);

handler.on('error', function(err) {
  console.error('Error:', err.message);
});

handler.on('push', function(event) {
  shelljs.exec(`git -C ${config.src} pull`);
  shelljs.exec(`hugo -s ${config.src} -d ${config.build}`);
});
