#!/usr/bin/env node
const http = require('node:http');
const yargs = require("yargs");
const fs = require('fs-extra');
const qrcode = require('qrcode-terminal');
const { getNetworkAddress } = require('../lib/helper');
const handler = require('../lib/middleware');
const message = "\nUsage: sharing <directory-path>";

const options = yargs
    .usage(message)
    .option("p", { default: 8989, alias: 'port', describe: "Change default port", type: "integer", demandOption: false })
    .help(true)
    .argv;

let path = options._[0];
if (!path) {
    console.log('Please specify path');
    return false
}


/**
 * check path exist
 */
if (!fs.existsSync(path)) {
    console.log('Directory not found');
    return false;
}


/**
 * Check is file
 */

const isFile = fs.lstatSync(path).isFile();
let fileName = undefined;
if (isFile) {
    const directoryPath = path.substring(0, path.lastIndexOf("/") + 1);
    fileName = path.substring(path.lastIndexOf("/") + 1, path.length);
    path = directoryPath;
}

/**
 * SERVER
 */
var server = http.createServer(function onRequest(req, res) {
    return handler(req, res, {
        path
    })
});

server.listen(options.port, () => {
    let message = 'Scan the QR-Code to access \'' + path + '\' directory on your phone';
    let file = '';
    if (isFile) {
        message = 'Scan the QR-Code to access \'' + fileName + '\' file on your phone';
        file = '/' + fileName;
    }
    const url = 'http://' + getNetworkAddress() + ':' + options.port + file;
    console.log(url);
    qrcode.generate(url, { small: true });
    console.log('Press ctrl+c to stop sharing')
})
