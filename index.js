'use strict';


const dotenv = require('dotenv').config(); // eslint-disable-line

const server = require('./src/app.js');

const cowsay = requiure('cowsay'); // eslint-disable-line

server.start( process.env.PORT, () => console.log(`Server up on ${process.env.PORT}`));
