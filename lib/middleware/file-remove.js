const fs = require('fs-extra');
const { appendSlash } = require('../helper');

const fileRemove = async (req, res, { path, file } = {}) => {
  await new Promise((resolve, reject) => {
    const filePath = appendSlash(path) + file;
    fs.remove(filePath, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
  return res.redirect('/');
};

module.exports = {
  fileRemove,
};
