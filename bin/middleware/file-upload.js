#!/usr/bin/env node
const formidable = require('formidable');
const fs = require('fs-extra');
const { appendSlash } = require('../helper');
const fileUpload = async (req, res, { path } = {}) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    var form = new formidable.IncomingForm();
    await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) throw err;
            var oldpath = files.filetoupload.filepath;
            try {
                fs.moveSync(oldpath, appendSlash(path) + files.filetoupload.originalFilename);
            } catch (error) {
                reject(error)
            }
            resolve();
        })
    })
    return res.end(JSON.stringify({
        data: 'File moved!'
    }));
}

module.exports = {
    fileUpload
}