const { directory } = require('./directory');
const { fileUpload } = require('./file-upload');
const parseUrl = require('parseurl');
const querystring = require('node:querystring');

const handler = (req, res, { path } = {}) => {
    if (req.method === 'POST') {
        const query = querystring.decode(req.url, null, null);
        if (query && !query.path) {
            return res.status(500).send('Invalid path')
        }
        return fileUpload(req, res, {
            path: query.path,
            originalPath: path
        });
    }
    return directory(req, res, { path })
}

module.exports = handler