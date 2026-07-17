const queryString = require('query-string');
const { directory } = require('./directory');
const { fileUpload } = require('./file-upload');
const { fileRemove } = require('./file-remove');
const { authMiddleware } = require('./auth');

const uploadRequests = new Map();

const withinRateLimit = (req, limit) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const recent = (uploadRequests.get(key) || []).filter((time) => now - time < 60000);
  if (recent.length >= limit) return false;
  recent.push(now);
  uploadRequests.set(key, recent);
  return true;
};

const handler = (
  req,
  res,
  {
    path, uploadFile = true, deleteFile = false, debug = false,
    maxUploadSize, allowedTypes, uploadRateLimit = 30,
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
    if (!withinRateLimit(req, uploadRateLimit)) {
      return res.status(429).send('Too many uploads. Please wait a minute and try again.');
    }
    const query = queryString.parse(req.url);
    if (query && !query.path) {
      return res.status(500).send('Invalid path');
    }
    return fileUpload(req, res, {
      path: query.path,
      originalPath: path,
      maxUploadSize,
      allowedTypes,
    });
  }

  return directory(req, res, {
    path,
    uploadFile,
    deleteFile,
    debug,
    maxUploadSize,
  });
};

module.exports = {
  handler,
  authMiddleware,
};
