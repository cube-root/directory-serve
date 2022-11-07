const { getNetworkAddress } = require('./network');
const { appendSlash } = require('./utils');
const { createHtmlResponse, uploadFileResponse, generateDeleteButton } = require('./html');

module.exports = {
  getNetworkAddress,
  appendSlash,
  createHtmlResponse,
  uploadFileResponse,
  generateDeleteButton,
};
