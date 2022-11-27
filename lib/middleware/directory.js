const send = require('send');
const parseUrl = require('parseurl');
const fs = require('fs-extra');
const {
  appendSlash,
  createHtmlResponse,
  uploadFileResponse,
  generateDeleteButton,
} = require('../helper');

const directory = (
  req,
  res,
  {
    path, uploadFile = true, deleteFile = false, debug = false,
  } = {},
) => {
  const stream = send(req, parseUrl(req).pathname, {
    index: false,
    root: path,
    dotfiles: 'allow',
  });
  stream.on('directory', async (resp, dirPath) => {
    const directoryPath = appendSlash(dirPath);
    let htmlResponse = '';
    /**
     * File upload html append
     */
    if (fs.lstatSync(directoryPath).isDirectory() && uploadFile) {
      htmlResponse += uploadFileResponse(dirPath, path);
    }
    await new Promise((resolve) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.log(err);
          resolve('<div>Error</div>');
        }
        htmlResponse
          += '<section class="bg-blue-50 py-6 px-4 flex-1 overflow-y-auto"><h3 class="text-xl font-sans font-medium mb-4 text-slate-500">Directory List</h3><ul class="flex flex-col space-y-4">';
        files.forEach((file) => {
          const filePath = directoryPath + file;
          if (fs.lstatSync(filePath).isFile()) {
            htmlResponse
              += '<li class="flex items-center space-x-2">'
              + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-amber-500 flex-shrink-0"><path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625z" /><path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" /></svg>'
              + `<a href="${encodeURIComponent(file)}">${file}</a>`
              + '<div>'
              + `<a target="_blank" download="${file}" class="text-blue-600 text-sm px-3 py-1 bg-blue-100 rounded-full inline-flex space-x-1" href='${encodeURIComponent(
                file,
              )}'>`
              + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>'
              + '<span>Download</span>'
              + `</a>${generateDeleteButton(file, deleteFile, 'Remove')}</div>`
              + '</li>';
          } else {
            htmlResponse
              += '<li class="flex items-center space-x-2">'
              + '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-blue-500 flex-shrink-0"><path d="M19.906 9c.382 0 .749.057 1.094.162V9a3 3 0 00-3-3h-3.879a.75.75 0 01-.53-.22L11.47 3.66A2.25 2.25 0 009.879 3H6a3 3 0 00-3 3v3.162A3.756 3.756 0 014.094 9h15.812zM4.094 10.5a2.25 2.25 0 00-2.227 2.568l.857 6A2.25 2.25 0 004.951 21H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-2.227-2.568H4.094z"/></svg>'
              + `<span>${file}</span>`
              + `<a class="text-blue-800 text-sm px-2 py-1 bg-blue-200 rounded-full" href="${appendSlash(
                req.url,
              )}${encodeURIComponent(file)}/">`
              + 'Open folder'
              + `</a>${generateDeleteButton(
                file,
                deleteFile,
                'Remove folder',
              )}</li>`;
          }
        });
        htmlResponse += '</ul></section>';
        resolve(htmlResponse);
      });
    });
    resp.setHeader('Content-Type', 'text/html; charset=UTF-8');
    return resp.end(createHtmlResponse(htmlResponse, { debug }));
  });
  stream.pipe(res);
};

module.exports = {
  directory,
};
