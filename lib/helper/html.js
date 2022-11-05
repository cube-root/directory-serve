const createHtmlResponse = (body) => (
  '<!DOCTYPE html>\n'
    + '<html lang="en">\n'
    + '<head>\n'
    + '<script src="https://cdn.tailwindcss.com"></script>'
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

        function nameClick(evnt, sender){

          if(event.currentTarget !== evnt.target ){
            evnt.preventDefault();
          }

          if(evnt.target.tagName.toLowerCase() !== 'button') { return false; }

          var spn = sender.querySelector('span');
          var inp = sender.querySelector('input');

          if(inp.style.display !== 'block'){
            spn.style.display = 'none';
            inp.style.display = 'block';
            inp.focus();
          }else{   
            spn.style.display = 'block';
            inp.style.display = 'none';
          }

        }

        function renameInput(evnt, sender){
          // console.log(evnt.key.toLowerCase() )
          if(evnt.key.toLowerCase() === 'enter'){
            let newHref = sender.parentNode.getAttribute("href").split('rename')[0]+'rename='+sender.value;
            sender.parentNode.setAttribute("href", newHref)
            sender.parentNode.click();
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
    + `<pre class='flex flex-col flex-1 h-screen'>${
      body
    }</pre>\n`
    + '</body>\n'
    + '</html>\n'
);

const uploadFileResponse = (path) => (
  '<section class="bg-slate-50 py-12 px-4">'
    + `<h1 class="sm:text-3xl text-lg font-sans mb-4 text-center sm:text-left break-normal">Upload files to ${path} </h1>`
    + `<form onsubmit="beforeFileUpload(event)" action="/?uploading=true&path=${path}" method="post" enctype="multipart/form-data" class="flex items-center sm:space-x-4 sm:space-y-0 sm:flex-row flex-col space-y-4 space-x-0 flex-wrap">`
    + '<label class="block">'
    + '<span class="sr-only">Choose profile photo</span>'
    + '<input type="file" name="filetoupload" class="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100"/></label>'
    + '<button type="submit" class="px-4 py-2 font-sans bg-purple-600 text-purple-50 inline-flex items-center space-x-2 rounded">'
    + '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">'
    + '<path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg><span>Upload</span></button></form>'
    + '</section>'
);

module.exports = {
  createHtmlResponse,
  uploadFileResponse,
};
