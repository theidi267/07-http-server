'use strict';

const bodyParser = module.exports = {};

bodyParser.execute = (req) => {

  return new Promise((resolve, reject) => {
    let text = '';

    req.on('data', (buffer) => {
      text = text + buffer.toString();
    });

    req.on('end', () => {
      try {
        req.body = JSON.parse(text);
        resolve(req);
      }
      catch (err) {
        reject(err);
      }

    });

  });
};