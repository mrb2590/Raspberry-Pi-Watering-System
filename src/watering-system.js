#!/usr/bin/env node

let hideOutput = typeof process.argv[2] !== 'undefined' && process.argv[2] === '--quiet';

const Controller = require('./lib/Controller.js');

const controller = new Controller(hideOutput);
controller.listen();
