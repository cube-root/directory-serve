#!/usr/bin/env node
const yargs = require('yargs');
const fs = require('fs-extra');
const qrcode = require('qrcode-terminal');
const express = require('express');
const { getNetworkAddress } = require('../lib/helper');
const { handler, authMiddleware } = require('../lib/middleware');

const app = express();
const yargsMessage = `directory-serve <directory-path>
Serve directory/file

Usage : directory-serve [path] [args]

Options
-p ............. Port

-u ............. Restrict upload file on client :default value is false

--username ..... Client auth username


--password ..... Client auth password

--delete   ..... Delete file/folder
* To serve a directory
directory-serve /path-of-directory

* To serve a file
directory-serve /path-of-file


`;

const options = yargs
  .usage(yargsMessage)
  .option('p', {
    default: 8989, alias: 'port', describe: 'Change default port', type: 'integer', demandOption: false,
  })
  .option('u', {
    default: true, alias: 'uploadFile', describe: 'File upload mode', type: 'boolean',
  })
  .options('username', {
    default: undefined, describe: 'Client auth username', type: 'string', demandOption: false,
  })
  .options('password', {
    default: undefined, describe: 'Client auth password', type: 'string', demandOption: false,
  })
  .options('delete', {
    default: false, alias: 'deleteFile', describe: 'Delete file/folder', type: 'boolean', demandOption: false,
  })
  .help(true)
  .argv;

const {
  uploadFile, username, password, deleteFile,
} = options;
let path = options._[0];
if (!path) {
  console.log('Please specify path');
  process.exit();
}

/**
 * check path exist
 */
if (!fs.existsSync(path)) {
  console.log('Directory not found');
  process.exit();
}

/**
 * Check is file
 */

const isFile = fs.lstatSync(path).isFile();
let fileName;
if (isFile) {
  const index = path.lastIndexOf('/');
  const directoryPath = path.substring(0, index + 1);
  fileName = path.substring(index, path.length);
  path = directoryPath;
}

/**
 * Auth
 */
app.use((req, res, next) => authMiddleware(req, res, next, {
  username, password,
}));
/**
 * SERVER
 */
app.use((req, res) => handler(req, res, {
  path,
  uploadFile,
  deleteFile,
}));

app.listen(options.port, () => {
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
