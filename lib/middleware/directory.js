const send = require("send");
const parseUrl = require("parseurl");
const fs = require("fs-extra");
const {
  appendSlash,
  createHtmlResponse,
  uploadFileResponse,
} = require("../helper");

const directory = (req, res, { path } = {}) => {
  let stream = send(req, parseUrl(req).pathname, { index: false, root: path });
  stream.on("directory", async (res, dirPath) => {
    const directoryPath = appendSlash(dirPath);
    let htmlResponse = "";
    /**
     * File upload html append
     */
    if (fs.lstatSync(directoryPath).isDirectory()) {
      htmlResponse += uploadFileResponse(dirPath, path);
    }
    await new Promise((resolve, reject) => {
      fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.log(err);
          resolve("<div>Error</div>");
        }
        htmlResponse +=
          '<section class="bg-blue-50 py-6 px-4 flex-1 overflow-y-auto"><h3 class="text-xl font-sans font-medium mb-4 text-slate-500">Directory List</h3><ul class="flex flex-col space-y-4">';
        files.forEach((file) => {
          const filePath = directoryPath + file;
          if (fs.lstatSync(filePath).isFile()) {
            htmlResponse +=
              '<li class="flex items-center space-x-2">' +
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-15a3 3 0 00-3 3V18a3 3 0 003 3h15zM1.5 10.146V6a3 3 0 013-3h5.379a2.25 2.25 0 011.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 013 3v1.146A4.483 4.483 0 0019.5 9h-15a4.483 4.483 0 00-3 1.146z" /></svg>' +
              '<a href="' +
              file +
              '">' +
              file +
              "</a>" +
              "<div>" +
              `<a target="_blank" class="text-blue-600 text-sm px-3 py-1 bg-blue-100 rounded-full inline-flex space-x-1" href=${file}>` +
              '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10.75 2.75a.75.75 0 00-1.5 0v8.614L6.295 8.235a.75.75 0 10-1.09 1.03l4.25 4.5a.75.75 0 001.09 0l4.25-4.5a.75.75 0 00-1.09-1.03l-2.955 3.129V2.75z" /><path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" /></svg>' +
              "<span>Download</span>" +
              "</a>" +
              "</div>" +
              "</li>";
          } else {
            htmlResponse +=
              '<li class="flex items-center space-x-2">' +
              '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">' +
              '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />' +
              "</svg>" +
              `<span>${file}</span>` +
              '<a class="text-blue-800 text-sm px-2 py-1 bg-blue-200 rounded-full" href="' +
              appendSlash(req.url) +
              file +
              "/" +
              '">' +
              "Open folder" +
              "</a>" +
              "</li>";
          }
        });
        htmlResponse += "</ul></section>";
        resolve(htmlResponse);
      });
    });
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    return res.end(createHtmlResponse(htmlResponse));
  });
  stream.pipe(res);
};

module.exports = {
  directory,
};
