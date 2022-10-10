const send = require('send');
const parseUrl = require('parseurl');
const fs = require('fs-extra');
const {
    appendSlash,
    createHtmlResponse,
    uploadFileResponse
} = require('../helper');

const directory = (req, res, { path } = {}) => {
    let stream = send(req, parseUrl(req).pathname, { index: false, root: path });


    stream.on('directory', async (res, dirPath) => {
        const directoryPath = appendSlash(dirPath);
        let htmlResponse = "";
        /**
         * File upload html append
         */
        if (fs.lstatSync(directoryPath).isDirectory()) {
            htmlResponse += uploadFileResponse(dirPath)
        }
        await new Promise((resolve, reject) => {
            fs.readdir(directoryPath, (err, files) => {
                if (err) {
                    console.log(err);
                    resolve('<div>Error</div>')
                };
                htmlResponse += '<dir>'
                files.forEach(file => {
                    const filePath = directoryPath + file;
                    if (fs.lstatSync(filePath).isFile()) {
                        htmlResponse += '<li style="margin-top: 10px;">' +
                            '<i class="fa fa-file"></i>' +
                            '<a style="margin-left: 10px; margin-bottom:10px" href="' + file + '">' + file + '</a>' +
                            '<br/>' +
                            '<div>' + '<a target="_blank" download style="margin-top: 50px; border-style: solid;" href="' + file + '">' + 'Download' + '</a>' + '</div>' +
                            '</li>'
                    } else {
                        htmlResponse += '<li style="margin-top: 10px;">' +
                            '<i class="fa fa-folder-open"></i>' +
                            '<a style="margin-left: 10px;" href="' + appendSlash(req.url) + file + '/' + '">' + file + '</a>' +
                            '</li>'
                    }
                })
                htmlResponse += '</dir>'
                resolve(htmlResponse);
            })
        });
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.end(createHtmlResponse(htmlResponse));
    })
    stream.pipe(res);
}


module.exports = {
    directory
}