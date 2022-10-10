const { getNetworkAddress } = require('./network');
const { appendSlash } = require('./utils');
const { createHtmlResponse } = require('./html');

module.exports = {
    getNetworkAddress,
    appendSlash,
    createHtmlResponse
}