const formidable = require('formidable');
const fs = require('fs-extra');
const { appendSlash } = require('../helper');

const fileUpload = async (req, res, { path } = {}) => {
  const form = new formidable.IncomingForm();
  await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) throw err;
      const { filepath, originalFilename } = files.filetoupload;
      let newPath = appendSlash(path) + originalFilename;
      if (fs.existsSync(newPath)) {
        newPath = `${appendSlash(path) + new Date().getTime()}_${originalFilename}`;
      }
      try {
        fs.moveSync(filepath, newPath);
      } catch (error) {
        reject(error);
      }
      resolve();
    });
  });
  return res.redirect('/');
};

module.exports = {
  fileUpload,
};
