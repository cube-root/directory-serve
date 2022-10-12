#!/usr/bin/env node
const createHtmlResponse = (body)=>{
    return '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">'+
    '<meta charset="utf-8">\n' +
    '</head>\n' +
    '<body>\n' +
    '<pre>' + body + '</pre>\n' +
    '</body>\n' +
    '</html>\n'
}


const  uploadFileResponse = (path)=>{
    return `<h1>Upload files to ${path} </h1>`+
 
    '<form action="/" method="post" enctype="multipart/form-data">'+
        '<input type="file" name="filetoupload">'+
        '<input type="submit" value="Upload">'+
    '</form><br/>'
}


module.exports = {
    createHtmlResponse,
    uploadFileResponse
}