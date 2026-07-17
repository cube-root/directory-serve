const send = require('send');
const parseUrl = require('parseurl');
const fs = require('fs-extra');
const {
  appendSlash, createHtmlResponse, uploadFileResponse, generateDeleteButton,
} = require('../helper');
const { icon } = require('../helper/html');

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const formatSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1; }
  return `${value >= 10 ? value.toFixed(0) : value.toFixed(1)} ${units[unit]}`;
};

const fileIcon = icon('M7 3h7l5 5v13H7V3Zm7 0v5h5');
const folderIcon = icon('M3 7h7l2 2h9v11H3V7Z');
const downloadIcon = icon('M12 3v12m0 0 4-4m-4 4-4-4M5 20h14');
const openIcon = icon('M9 18l6-6-6-6');
const searchIcon = icon('M21 21l-4.4-4.4m2.4-5.1a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z');

const directory = (req, res, {
  path, uploadFile = true, deleteFile = false, debug = false,
  maxUploadSize = 100 * 1024 * 1024,
} = {}) => {
  const stream = send(req, parseUrl(req).pathname, { index: false, root: path, dotfiles: 'allow' });
  stream.on('directory', (resp, dirPath) => {
    const directoryPath = appendSlash(dirPath);
    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        resp.writeHead(500, { 'Content-Type': 'text/html; charset=UTF-8' });
        return resp.end(createHtmlResponse('<section class="card empty"><strong>Could not open this folder</strong>Please try again.</section>', { debug, path: req.path }));
      }

      const sortedFiles = files.map((file) => {
        const stats = fs.lstatSync(directoryPath + file);
        return { file, stats, isFile: stats.isFile() };
      }).sort((a, b) => Number(a.isFile) - Number(b.isFile) || a.file.localeCompare(b.file));

      const currentUrl = appendSlash(parseUrl(req).pathname);
      const rows = sortedFiles.map(({ file, stats, isFile }) => {
        const safeName = escapeHtml(file);
        const href = encodeURIComponent(file);
        if (isFile) {
          return `<li class="file-row" data-name="${safeName.toLowerCase()}" data-type="file" data-size="${stats.size}" data-modified="${stats.mtimeMs}"><span class="file-icon">${fileIcon}</span><div class="file-info"><a class="file-name" href="${href}" title="${safeName}">${safeName}</a><div class="file-meta">${formatSize(stats.size)} · ${stats.mtime.toLocaleDateString()}</div></div><div class="actions"><a class="action" download="${safeName}" href="${href}" aria-label="Download ${safeName}">${downloadIcon}<span>Download</span></a>${generateDeleteButton(file, deleteFile)}</div></li>`;
        }
        return `<li class="file-row" data-name="${safeName.toLowerCase()}" data-type="folder" data-size="0" data-modified="${stats.mtimeMs}"><span class="file-icon folder">${folderIcon}</span><div class="file-info"><a class="file-name" href="${currentUrl}${href}/" title="${safeName}">${safeName}</a><div class="file-meta">Folder · ${stats.mtime.toLocaleDateString()}</div></div><div class="actions"><a class="action" href="${currentUrl}${href}/" aria-label="Open ${safeName}">${openIcon}<span>Open</span></a>${generateDeleteButton(file, deleteFile, 'Remove')}</div></li>`;
      }).join('');

      const parent = parseUrl(req).pathname !== '/'
        ? '<div class="back-row"><a class="back-link" href="../">← Back to parent folder</a></div>' : '';
      const list = rows || '<li class="empty"><strong>This folder is empty</strong>Upload a file to get started.</li>';
      const toolbar = `<div class="browser-tools"><label class="search-box">${searchIcon}<input id="fileSearch" type="search" placeholder="Search files" aria-label="Search files"></label><select id="typeFilter" aria-label="Filter items"><option value="all">All items</option><option value="file">Files</option><option value="folder">Folders</option></select><select id="sortFiles" aria-label="Sort items"><option value="name">Name</option><option value="modified">Recently modified</option><option value="size">Largest</option><option value="type">Type</option></select><div class="view-toggle" aria-label="View style"><button class="view-button active" type="button" data-view="list" title="List view">☰</button><button class="view-button" type="button" data-view="grid" title="Grid view">▦</button></div></div>`;
      const browser = `<section class="card browser-card"><div class="card-head"><h2>Files and folders</h2><span class="count" id="visibleCount">${files.length} item${files.length === 1 ? '' : 's'}</span></div>${toolbar}${parent}<ul class="file-list" id="fileList">${list}</ul><div class="empty search-empty" hidden><strong>No matching files</strong>Try another search or filter.</div></section>`;
      const addFileSize = (total, entry) => (
        total + (entry.isFile ? entry.stats.size : 0)
      );
      const totalSize = sortedFiles.reduce(addFileSize, 0);
      const stats = `<section class="card storage-card"><div><span>Current folder</span><strong>${formatSize(totalSize)}</strong></div><div><span>Items</span><strong>${files.length}</strong></div><div><span>Per-file limit</span><strong>${formatSize(maxUploadSize)}</strong></div></section>`;
      const uploader = uploadFile && fs.lstatSync(directoryPath).isDirectory()
        ? uploadFileResponse(dirPath) : '';
      const body = `<div class="grid">${browser}<aside class="sidebar">${uploader}${stats}</aside></div>`;
      resp.setHeader('Content-Type', 'text/html; charset=UTF-8');
      const displayPath = escapeHtml(parseUrl(req).pathname);
      return resp.end(createHtmlResponse(body, { debug, path: displayPath }));
    });
  });
  stream.pipe(res);
};

module.exports = { directory };
