
const fs = require('fs-extra'); 

const fileRename = async (req, res, { currentPath, newPath } = {}) => {
 
  await new Promise((resolve, reject) => {
 
    fs.rename(currentPath, newPath, (err) => {
      if(err) {
        reject(err);
      }else{
        resolve();
      }
    });

  });
  return res.redirect('/');
};

module.exports = {
  fileRename,
};
