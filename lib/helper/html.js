const createHtmlResponse = (body) => {
  return (
    "<!DOCTYPE html>\n" +
    '<html lang="en">\n' +
    "<head>\n" +
    '<script src="https://cdn.tailwindcss.com"></script>' +
    '<meta charset="utf-8">\n' +
    "</head>\n" +
    '<body class="font-sans container mx-auto">\n' +
    "<pre class='flex flex-col flex-1 h-screen'>" +
    body +
    "</pre>\n" +
    "</body>\n" +
    "</html>\n"
  );
};

const uploadFileResponse = (path) => {
  return (
    '<section class="bg-slate-50 py-12 px-4">' +
    `<h1 class="sm:text-3xl text-lg font-sans mb-4 text-center sm:text-left break-normal">Upload files to ${path} </h1>` +
    `<form action="/?uploading=true&path=${path}" method="post" enctype="multipart/form-data" class="flex items-center sm:space-x-4 sm:space-y-0 sm:flex-row flex-col space-y-4 space-x-0 flex-wrap">` +
    '<label class="block">' +
    '<span class="sr-only">Choose profile photo</span>' +
    '<input type="file" name="filetoupload" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/></label>' +
    '<button type="submit" class="px-4 py-2 font-sans bg-purple-600 text-purple-50 inline-flex items-center space-x-2 rounded">' +
    '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">' +
    '<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg><span>Upload</span></button></form>' +
    "</section>"
  );
};

module.exports = {
  createHtmlResponse,
  uploadFileResponse,
};
