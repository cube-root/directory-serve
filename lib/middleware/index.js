const querystring = require('node:querystring');
const { directory } = require('./directory');
const { fileUpload } = require('./file-upload');
const { authMiddleware } = require('./auth');

const handler = (req, res, { path, uploadFile = true } = {}) => {
  if (req.method === 'POST' && uploadFile) {
    const query = querystring.decode(req.url, null, null);
    if (query && !query.path) {
      return res.status(500).send('Invalid path');
    }
    return fileUpload(req, res, {
      path: query.path,
      originalPath: path,
      uploadFile,
    });
  }
  return directory(req, res, { path, uploadFile });
};

module.exports = {
  handler,
  authMiddleware,
};
