'use strict';


const dotenv = require('dotenv').config(); // eslint-disable-line

const server = require('./src/app.js');

server.start( process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));
