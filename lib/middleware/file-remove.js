
const fs = require('fs-extra'); 

const fileRemove = async (req, res, { path } = {}) => {
 
  await new Promise((resolve, reject) => {
 
    fs.remove(path, err => {
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
  fileRemove,
};
