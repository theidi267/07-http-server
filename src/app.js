'use strict';

// 1st Party library
const http = require('http');

// Local Libraries
// requestParser will tear the URL apart and give us back an object with things like path, query params, etc.
const requestParser = require('./lib/parse-request');
// bodyParser reads in all of the post data in packets and puts the resulting JSON object (if it exists) on req.body
const bodyParser = require('./lib/parse-body');

const requestHandler = (req,res) => {

  // Take a look here if you're interested to see what some parts of the request object are.
  // console.log(req.method);
  // console.log(req.headers);
  // console.log(req.url);

  // In all cases, parse the URL
  requestParser.execute(req);

  // The "if" statements below do the same things that express does (below comments) but 100% manually
    // app.get('/', (req,res) => res.send('Hello From the Gutter'));
    // app.get('/foo/bar/baz', (req,res) => res.send('Hello From the Gutter'));
  if ( req.method === 'GET' ) {
    res.setHeader('Content-Type', 'text/html');
    res.statusCode = 200;
    res.statusMessage = 'OK';

    // Send out some random HTML (actually, it's not totally random. Note how it includes req.url.query.you ...
    // That would show whatever you have in the URL after you = (http://localhost:3000?this=that&you=cool
    res.write(`<!DOCTYPE html><html><body><h1>${req.url.query.you}</h1></body></html>`);
    // ... Instead of doing manual HTML like that, you could have used the "fs" module to read a file
    // and "res.write()" the contents of that file.


    res.end();
    return;
  }

  // Here, we have a "POST" request which will always return a JSON object.  That object will either be
  // the JSON that you posted in (just spitting it back out), or an error object, formatted to look like JSON
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

// Server callback
const app = http.createServer(requestHandler);

// Expose the start and stop methods.  index.js will call on these.
module.exports = {
  start: (port,callback) => app.listen(port,callback),
  stop: (callback) => app.close(callback),
};