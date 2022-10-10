const http = require('node:http');
const yargs = require("yargs");
const os = require('node:os');
const fs = require('fs-extra');
const { getNetworkAddress } = require('./helper');

const message = "\nUsage: sharing <directory-path>";

const options = yargs
    .usage(message)
    .option("p", { default: 8989, alias: 'port', describe: "Change default port", type: "integer", demandOption: false })
    .help(true)
    .argv;

let path = options._[0];
if (!path) {
    console.log('Please specify path');
    return false;
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

