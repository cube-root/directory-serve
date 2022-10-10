const { directory } = require('./directory');
const { fileUpload } = require('./file-upload');


const handler = (req, res, { path } = {}) => {
    if (req.method === 'POST') {
        return fileUpload(req, res, {
            path: path
        });
    }
    return directory(req, res, { path })
}
module.exports = handler