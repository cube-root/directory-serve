const createHtmlResponse = (body) => (
  '<!DOCTYPE html>\n'
  + '<html lang="en">\n'
  + '<head>\n'
  // + '<script src="https://cdn.tailwindcss.com"></script>'
  + '<link rel="stylesheet" type="text/css" href="lib/helper/style.css" />'
  + `<script type="text/javascript">
        function beforeFileUpload(evnt){
          var files = document.getElementsByName('filetoupload')[0].files;
          if(!(files && files.length > 0 && files[0])){
            evnt.preventDefault();
            var selectFileWarning = document.getElementById('selectFileWarning');
            selectFileWarning.style.display = 'block';
            setTimeout(function(){
              selectFileWarning.style.display = 'none';
            }, 3500)
          }
        }  
      </script>`
  + '<meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
  + '</head>\n'
  + '<body class="font-sans container mx-auto">\n'
  + `<div id="selectFileWarning" style="display: none; width: 100vw; position: absolute; top: 0; left: 0;" class="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
        <p class="font-bold">No File Selected!</p>
        <p class="text-sm">Please, select file for upload!</p>
      </div>`
  + `<pre class='flex flex-col flex-1 h-screen'>${body
  }</pre>\n`
  + '</body>\n'
  + '</html>\n'
);

const uploadFileResponse = (path) => (
  '<section class="bg-slate-50 py-12 px-4">'
  + `<h1 class="sm:text-3xl text-lg font-sans mb-4 text-center sm:text-left whitespace-normal">Upload files to ${path} </h1>`
  + `<form onsubmit="beforeFileUpload(event)" action="/?uploading=true&path=${path}" method="post" enctype="multipart/form-data" class="flex items-center sm:space-x-4 sm:space-y-0 sm:flex-row flex-col space-y-4 space-x-0 flex-wrap">`
  + '<label class="block">'
  + '<span class="sr-only">Choose profile photo</span>'
  + '<input type="file" name="filetoupload" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/></label>'
  + '<button type="submit" class="px-4 py-2 font-sans bg-purple-600 text-purple-50 inline-flex items-center space-x-2 rounded">'
  + '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">'
  + '<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg><span>Upload</span></button></form>'
  + '</section>'
);

const generateDeleteButton = (file, deleteFile, label = 'Remove') => (!deleteFile === true ? '' : (
  `<a target="_self" class="ml-1 text-blue-600 text-sm px-3 py-1 bg-blue-100 rounded-full inline-flex space-x-1" href="${`${encodeURIComponent(file)}?delete=true&file=${encodeURIComponent(file)}`}">`
  + '<svg xmlns="http://www.w3.org/2000/svg"  fill="currentColor" viewBox="0 0 100 100" class="w-4 h-4"><path d="M 41.146484 13 C 38.309484 13 36 15.400516 36 18.353516 L 36 20 L 29.271484 20 C 20.784484 20 17 23.628672 17 31.763672 L 17 32 L 17 37 C 17 37.265 17.104969 37.520031 17.292969 37.707031 L 22 42.414062 L 22 45.019531 C 19.720904 45.484373 18 47.503605 18 49.917969 L 18 53.917969 C 18 56.332332 19.720904 58.349612 22 58.814453 L 22 75.308594 C 22 82.301594 27.129625 87 34.765625 87 L 65.035156 87 C 72.790156 87 78 82.301594 78 75.308594 L 78 58.814453 C 80.279096 58.349435 82 56.331456 82 53.917969 L 82 49.917969 C 82 47.503605 80.279096 45.484373 78 45.019531 L 78 42.335938 L 82.701172 37.712891 C 82.892172 37.524891 83 37.268 83 37 L 83 32 L 83 31.763672 C 83 23.628672 79.214562 20 70.726562 20 L 64 20 L 64 18.353516 C 64 15.400516 61.690516 13 58.853516 13 L 41.146484 13 z M 41.146484 15 L 58.853516 15 C 60.588516 15 62 16.503516 62 18.353516 L 62 20 L 38 20 L 38 18.353516 C 38 16.503516 39.411484 15 41.146484 15 z M 29.271484 22 L 70.728516 22 C 77.751516 22 80.772281 24.62 80.988281 31 L 19.013672 31 C 19.037903 30.284297 19.102703 29.622679 19.199219 29 L 72.5 29 C 72.776 29 73 28.776 73 28.5 C 73 28.224 72.776 28 72.5 28 L 19.394531 28 C 20.412123 23.791139 23.476889 22 29.271484 22 z M 75.5 28 C 75.224 28 75 28.224 75 28.5 C 75 28.776 75.224 29 75.5 29 L 78.5 29 C 78.776 29 79 28.776 79 28.5 C 79 28.224 78.776 28 78.5 28 L 75.5 28 z M 19 33 L 81 33 L 81 35 L 19 35 L 19 33 z M 19 36 L 81 36 L 81 36.580078 L 76.298828 41.203125 C 76.107828 41.391125 76 41.649969 76 41.917969 L 76 45.917969 L 76 57.917969 L 76 75.308594 C 76 77.699141 75.331005 79.562683 74.263672 81 L 25.705078 81 C 24.657058 79.562673 24 77.699185 24 75.308594 L 24 57.917969 L 24 45.917969 L 24 42 C 24 41.735 23.895031 41.479969 23.707031 41.292969 L 19 36.585938 L 19 36 z M 32 39.917969 C 30.346 39.917969 29 41.263969 29 42.917969 L 29 60.5 C 29 60.776 29.224 61 29.5 61 C 29.776 61 30 60.776 30 60.5 L 30 42.917969 C 30 41.814969 30.897 40.917969 32 40.917969 C 33.103 40.917969 34 41.814969 34 42.917969 L 34 73.917969 C 34 75.020969 33.103 75.917969 32 75.917969 C 30.897 75.917969 30 75.020969 30 73.917969 L 30 70.5 C 30 70.224 29.776 70 29.5 70 C 29.224 70 29 70.224 29 70.5 L 29 73.917969 C 29 75.571969 30.346 76.917969 32 76.917969 C 33.654 76.917969 35 75.571969 35 73.917969 L 35 42.917969 C 35 41.263969 33.654 39.917969 32 39.917969 z M 44 40 C 42.346 40 41 41.346 41 43 L 41 74 C 41 75.654 42.346 77 44 77 C 45.654 77 47 75.654 47 74 L 47 43 C 47 41.346 45.654 40 44 40 z M 56 40 C 54.346 40 53 41.346 53 43 L 53 74 C 53 75.654 54.346 77 56 77 C 57.654 77 59 75.654 59 74 L 59 43 C 59 41.346 57.654 40 56 40 z M 68 40 C 66.346 40 65 41.346 65 43 L 65 74 C 65 75.654 66.346 77 68 77 C 69.654 77 71 75.654 71 74 L 71 43 C 71 41.346 69.654 40 68 40 z M 44 41 C 45.103 41 46 41.897 46 43 L 46 74 C 46 75.103 45.103 76 44 76 C 42.897 76 42 75.103 42 74 L 42 43 C 42 41.897 42.897 41 44 41 z M 56 41 C 57.103 41 58 41.897 58 43 L 58 74 C 58 75.103 57.103 76 56 76 C 54.897 76 54 75.103 54 74 L 54 43 C 54 41.897 54.897 41 56 41 z M 68 41 C 69.103 41 70 41.897 70 43 L 70 74 C 70 75.103 69.103 76 68 76 C 66.897 76 66 75.103 66 74 L 66 43 C 66 41.897 66.897 41 68 41 z M 22 47.087891 L 22 56.746094 C 20.836 56.333094 20 55.221969 20 53.917969 L 20 49.917969 C 20 48.613969 20.836 47.500891 22 47.087891 z M 78 47.087891 C 79.164 47.499891 80 48.613016 80 49.916016 L 80 53.916016 C 80 55.220016 79.164 56.331141 78 56.744141 L 78 47.087891 z M 29.5 62 C 29.224 62 29 62.224 29 62.5 L 29 65.5 C 29 65.776 29.224 66 29.5 66 C 29.776 66 30 65.776 30 65.5 L 30 62.5 C 30 62.224 29.776 62 29.5 62 z M 26.5625 82 L 73.390625 82 C 71.203553 84.130185 67.979596 85 65.035156 85 L 34.765625 85 C 31.874792 85 28.709915 84.130103 26.5625 82 z"/></svg>'
  + `<span>${label}</span>`
  + '</a>'
));

module.exports = {
  createHtmlResponse,
  uploadFileResponse,
  generateDeleteButton,
};
