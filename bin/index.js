#!/usr/bin/env node
const http = require('node:http');
const yargs = require('yargs');
const fs = require('fs-extra');
const qrcode = require('qrcode-terminal');
const { getNetworkAddress } = require('../lib/helper');
const handler = require('../lib/middleware');

const yargsMessage = '\n directory-serve <directory-path>';

const options = yargs
  .usage(yargsMessage)
  .option('p', {
    default: 8989, alias: 'port', describe: 'Change default port', type: 'integer', demandOption: false,
  })
  .help(true)
  .argv;

let path = options._[0];
if (!path) {
  console.log('Please specify path');
  process.exit(1);
}

/**
 * check path exist
 */
if (!fs.existsSync(path)) {
  console.log('Directory not found');
  process.exit(1);
}

/**
 * Check is file
 */

const isFile = fs.lstatSync(path).isFile();
let fileName;
if (isFile) {
  const directoryPath = path.substring(0, path.lastIndexOf('/') + 1);
  fileName = path.substring(path.lastIndexOf('/') + 1, path.length);
  path = directoryPath;
}

/**
 * SERVER
 */
const server = http.createServer((req, res) => handler(req, res, {
  path,
}));

server.listen(options.port, () => {
  let message = 'Scan the QR Code to access directory';
  let file = '';
  if (isFile) {
    message = 'Scan the QR Code to access file on your phone';
    file = `/${fileName}`;
  }
  console.log(message);
  const url = `http://${getNetworkAddress()}:${options.port}${file}`;
  console.log(url);
  qrcode.generate(url, { small: true });
  console.log('NOTE: Devices should be in same network');
  console.log('Press ctrl+c to stop sharing');
});
