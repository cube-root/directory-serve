const queryString = require('query-string');
const { directory } = require('./directory');
const { fileUpload } = require('./file-upload');
const { fileRemove } = require('./file-remove');
const { authMiddleware } = require('./auth');

const handler = (
  req,
  res,
  {
    path, uploadFile = true, deleteFile = false, debug = false,
  } = {},
) => {
  if (
    req.query.file
    && req.query.delete
    && req.query.delete.toLowerCase() === 'true'
    && deleteFile
  ) {
    return fileRemove(req, res, {
      // path: `${path.replace(/[/]$/, '')}/${req.path.replace(/^[/]/, '')}`,
      path,
      file: decodeURIComponent(req.query.file),
    });
  }

  if (req.method === 'POST' && uploadFile) {
    const query = queryString.parse(req.url);
    if (query && !query.path) {
      return res.status(500).send('Invalid path');
    }
    return fileUpload(req, res, {
      path: query.path,
      originalPath: path,
      uploadFile,
    });
  }

  return directory(req, res, {
    path,
    uploadFile,
    deleteFile,
    debug,
  });
};

module.exports = {
  handler,
  authMiddleware,
};
