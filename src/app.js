'use strict';

const http = require('http');

const fs = require('fs');

const requestParser = require('./lib/parse-request');

const bodyParser = require('./lib/parse-body');

const requestHandler = (req,res) => {

  requestParser.execute(req);

  if ( req.method === 'GET' && req.url.pathname === '/') {
    fs.readFile('index.html', (err, data) => { 
      if (err) throw err;

      let result = data.toString().replace(/Change Content/, req.url.query.that);

      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.write(result);
      res.end();
      return;
    });
  }

  else if ( req.method === 'POST' ) {

    bodyParser.execute(req)
      .then( (req) => {
        res.setHeader('Content-Type', 'text/json');
        res.statusCode = 200;
        res.statusMessage = 'OK';
        res.write( JSON.stringify(req.body) );
        res.end();
        return;
      })
      .catch( (err) => {
        let errorObject = {error:err};
        res.setHeader('Content-Type', 'text/json');
        res.statusCode = 500;
        res.statusMessage = 'Server Error';
        res.write( JSON.stringify(errorObject) );
        res.end();
        return;
      });
  }
};

const app = http.createServer(requestHandler);

module.exports = {
  start: (port,callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),
};
