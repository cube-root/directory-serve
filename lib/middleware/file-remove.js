const fs = require('fs-extra');
const nodePath = require('path');

const isWithin = (root, target) => {
  const relative = nodePath.relative(root, target);
  return relative !== '..'
    && !relative.startsWith(`..${nodePath.sep}`)
    && !nodePath.isAbsolute(relative);
};

const fileRemove = async (req, res, { path, file } = {}) => {
  if (typeof file !== 'string' || file.length === 0 || file.includes('\0')) {
    return res.status(400).send('Invalid file to delete.');
  }

  const root = nodePath.resolve(path);
  const target = nodePath.resolve(root, file);
  if (nodePath.isAbsolute(file) || target === root || !isWithin(root, target)) {
    return res.status(403).send('Deletion must stay inside the shared directory.');
  }

  try {
    const realRoot = await fs.realpath(root);
    const realParent = await fs.realpath(nodePath.dirname(target));
    if (!isWithin(realRoot, realParent)) {
      return res.status(403).send('Deletion must stay inside the shared directory.');
    }

    // Check symlink ancestors, but leave the final component unresolved so removing a
    // symlink unlinks the link itself. Delete through the checked, canonical parent.
    await fs.remove(nodePath.join(realParent, nodePath.basename(target)));
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR') {
      return res.status(404).send('File or directory not found.');
    }
    if (error.code === 'EACCES' || error.code === 'EPERM') {
      return res.status(403).send('Permission denied.');
    }
    return res.status(500).send('Unable to delete file or directory.');
  }
  return res.redirect('/');
};

module.exports = {
  fileRemove,
};
