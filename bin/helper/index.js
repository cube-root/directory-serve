#!/usr/bin/env node
const { getNetworkAddress } = require('./network');
const { appendSlash } = require('./utils');
const { createHtmlResponse,uploadFileResponse } = require('./html');

module.exports = {
    getNetworkAddress,
    appendSlash,
    createHtmlResponse,
    uploadFileResponse
}