const formidable = require('formidable');
const fs = require('fs-extra');
const nodePath = require('path');
const { appendSlash } = require('../helper');

const normalizeFiles = (value) => (Array.isArray(value) ? value : [value]).filter(Boolean);

const fileUpload = async (req, res, {
  path, originalPath, maxUploadSize = 100 * 1024 * 1024, allowedTypes = [],
} = {}) => {
  const root = nodePath.resolve(originalPath);
  const destination = nodePath.resolve(path);
  if (destination !== root && !destination.startsWith(`${root}${nodePath.sep}`)) {
    return res.status(403).send('Upload destination is outside the shared directory.');
  }

  const form = new formidable.IncomingForm({
    maxFileSize: maxUploadSize,
    multiples: true,
    filter: ({ originalFilename }) => {
      if (!allowedTypes.length) return true;
      const extension = nodePath.extname(originalFilename || '').toLowerCase().slice(1);
      return allowedTypes.includes(extension);
    },
  });

  try {
    await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        const uploads = normalizeFiles(files.filetoupload);
        if (!uploads.length) return reject(new Error('No accepted files were provided.'));
        uploads.forEach((upload, index) => {
          const safeName = nodePath.basename(upload.originalFilename || `upload-${index + 1}`);
          let newPath = appendSlash(destination) + safeName;
          if (fs.existsSync(newPath)) {
            newPath = `${appendSlash(destination) + Date.now()}_${safeName}`;
          }
          fs.moveSync(upload.filepath, newPath);
        });
        return resolve();
      });
    });
    return res.status(200).json({ uploaded: true });
  } catch (error) {
    const tooLarge = error.code === 1009 || /maxFileSize/i.test(error.message);
    return res.status(tooLarge ? 413 : 400).send(tooLarge
      ? 'One or more files exceed the upload size limit.' : error.message);
  }
};

module.exports = { fileUpload };
