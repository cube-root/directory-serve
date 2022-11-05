const querystring = require('node:querystring');
const { directory } = require('./directory');
const { fileUpload } = require('./file-upload');
const { fileRemove } = require('./file-remove');
const { fileRename } = require('./file-rename');
const { authMiddleware } = require('./auth');

const handler = (req, res, { path, uploadFile = true } = {}) => {

  if(req.query.rename){
    let currentPath = path.replace(/[/]$/, '') + '/' + req.path.replace(/^[/]/, '');
    let newPath = currentPath.split('/');
    newPath.pop()
    newPath.push(req.query.rename);
    newPath = newPath.join('/')
    return fileRename(req, res, {
      currentPath: decodeURI(currentPath),
      newPath: decodeURI(newPath)
    });
  }

  if(req.query.delete && req.query.delete.toLowerCase() === 'true'){
    return fileRemove(req, res, {
      path: decodeURI(path.replace(/[/]$/, '') + '/' + req.path.replace(/^[/]/, ''))
    });
  }

  if (req.method === 'POST' && uploadFile) {
    const query = querystring.decode(req.url, null, null);
    if (query && !query.path) {
      return res.status(500).send('Invalid path');
    }
    return fileUpload(req, res, {
      path: decodeURI(query.path),
      originalPath: decodeURI(path),
      uploadFile,
    });
  }
  return directory(req, res, { path, uploadFile });
};

module.exports = {
  handler,
  authMiddleware,
};
