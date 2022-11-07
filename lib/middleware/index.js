const querystring = require('node:querystring');
const { directory } = require('./directory');
const { fileUpload } = require('./file-upload');
const { fileRemove } = require('./file-remove');
const { authMiddleware } = require('./auth');

const handler = (req, res, { path, uploadFile = true, deleteFile = false } = {}) => {
  if (req.query.delete && req.query.delete.toLowerCase() === 'true' && deleteFile) {
    return fileRemove(req, res, {
      path: `${path.replace(/[/]$/, '')}/${req.path.replace(/^[/]/, '')}`,
    });
  }

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

  return directory(req, res, { path, uploadFile, deleteFile });
};

module.exports = {
  handler,
  authMiddleware,
};
