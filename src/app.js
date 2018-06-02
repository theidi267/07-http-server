'use strict';

const http = require('http');

const fs = require('fs');

const requestParser = require('./lib/parse-request');

const bodyParser = require('./lib/parse-body');

const requestHandler = (req,res) => {

  requestParser.execute(req);

  if ( req.method === 'GET' ) {
    fs.readFile('index.html', (err, data) => { 
      res.setHeader('Content-Type', 'text/html');
      res.statusCode = 200;
      res.statusMessage = 'OK';
      res.write(data.toString());
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
