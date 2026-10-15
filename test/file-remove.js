const assert = require('assert').strict;
const http = require('http');
const os = require('os');
const path = require('path');
const express = require('express');
const fs = require('fs-extra');
const { handler, authMiddleware } = require('../lib/middleware');

const cases = [
  { name: 'rejects plain traversal', query: 'file=../outside/victim_dir&delete=true', status: 403 },
  { name: 'rejects encoded traversal', file: '../outside/victim_dir', status: 403 },
  { name: 'rejects absolute paths', file: ({ outside }) => path.join(outside, 'victim_dir'), status: 403 },
  { name: 'rejects sibling directories with the same prefix', file: '../shared-other/victim_dir', status: 403 },
  { name: 'rejects the shared root', file: '.', status: 403 },
  { name: 'rejects normalized paths to the root', file: 'folder/..', status: 403 },
  { name: 'rejects traversal back to the root', file: '../shared', status: 403 },
  { name: 'rejects missing filenames', query: 'delete=true', status: 400 },
  { name: 'rejects empty filenames', file: '', status: 400 },
  { name: 'rejects null bytes', file: 'victim\0.txt', status: 400 },
  { name: 'rejects repeated filenames', query: 'delete=true&file=a&file=b', status: 400 },
  { name: 'rejects object filenames', query: 'delete=true&file[name]=a', status: 400 },
  { name: 'rejects repeated delete flags', query: 'delete=true&delete=true&file=a', status: 400 },
  { name: 'rejects object delete flags', query: 'delete[value]=true&file=a', status: 400 },
  { name: 'rejects symlink ancestors pointing outside', file: 'escape/victim_dir', status: 403 },
  {
    name: 'allows a symlink chain whose resolved parent is inside',
    file: 'escape/back/inside.txt',
    status: 302,
    removed: 'inside.txt',
  },
  {
    name: 'deletes a regular file', file: 'inside.txt', status: 302, removed: 'inside.txt',
  },
  {
    name: 'deletes a nested file', file: 'folder/nested.txt', status: 302, removed: 'folder/nested.txt',
  },
  {
    name: 'deletes a directory recursively', file: 'folder', status: 302, removed: 'folder',
  },
  {
    name: 'allows filenames starting with two dots', file: '..notes', status: 302, removed: '..notes',
  },
  {
    name: 'allows percent characters in filenames', file: '100%done.txt', status: 302, removed: '100%done.txt',
  },
  {
    name: 'decodes filenames only once', file: '%2e%2e%2foutside%2fvictim_dir', status: 302, removed: '%2e%2e%2foutside%2fvictim_dir',
  },
  {
    name: 'unlinks an external symlink without deleting its target', file: 'escape', status: 302, removed: 'escape',
  },
  {
    name: 'unlinks a dangling symlink', file: 'dangling', status: 302, removed: 'dangling',
  },
  {
    name: 'unlinks a symlink to the root', file: 'root-link', status: 302, removed: 'root-link',
  },
  {
    name: 'deletes through an internal symlink', file: 'internal-link/nested.txt', status: 302, removed: 'folder/nested.txt',
  },
  {
    name: 'supports a symlink as the configured root', file: 'inside.txt', rootAlias: true, status: 302, removed: 'inside.txt',
  },
  {
    name: 'supports a relative configured root', file: 'inside.txt', relativeRoot: true, status: 302, removed: 'inside.txt',
  },
  { name: 'preserves idempotent deletion of a missing file', file: 'missing.txt', status: 302 },
  { name: 'handles a missing parent directory', file: 'missing/file.txt', status: 404 },
  {
    name: 'respects disabled deletion', file: '../outside/victim_dir', deleteFile: false, status: 200,
  },
  {
    name: 'requires configured authentication', file: '../outside/victim_dir', auth: true, status: 401,
  },
  {
    name: 'blocks traversal even for authenticated clients', file: '../outside/victim_dir', auth: true, credentials: true, status: 403,
  },
  {
    name: 'allows authenticated deletion inside the share', file: 'inside.txt', auth: true, credentials: true, status: 302, removed: 'inside.txt',
  },
];

const request = (server, query, credentials) => new Promise((resolve, reject) => {
  const headers = credentials
    ? { Authorization: `Basic ${Buffer.from('test-user:test-password').toString('base64')}` }
    : {};
  http.get({
    hostname: '127.0.0.1',
    port: server.address().port,
    path: `/?${query}`,
    headers,
  }, (res) => {
    let body = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => { body += chunk; });
    res.on('end', () => resolve({ status: res.statusCode, location: res.headers.location, body }));
    res.on('error', reject);
  }).on('error', reject);
});

const runCase = async (test) => {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'directory-serve-delete-test-'));
  const root = path.join(base, 'shared');
  const outside = path.join(base, 'outside');
  const sibling = path.join(base, 'shared-other');
  let server;
  try {
    await Promise.all([
      fs.outputFile(path.join(outside, 'victim_dir', 'sentinel.txt'), 'outside data'),
      fs.outputFile(path.join(sibling, 'victim_dir', 'sentinel.txt'), 'sibling data'),
      fs.outputFile(path.join(root, 'inside.txt'), 'inside data'),
      fs.outputFile(path.join(root, 'keep.txt'), 'keep data'),
      fs.outputFile(path.join(root, 'folder', 'nested.txt'), 'nested data'),
      fs.outputFile(path.join(root, '..notes'), 'dot-prefixed data'),
      fs.outputFile(path.join(root, '100%done.txt'), 'percent data'),
      fs.outputFile(path.join(root, '%2e%2e%2foutside%2fvictim_dir'), 'encoded name'),
    ]);
    await Promise.all([
      fs.ensureSymlink(outside, path.join(root, 'escape'), 'dir'),
      fs.ensureSymlink(outside, path.join(root, 'folder', 'external-link'), 'dir'),
      fs.ensureSymlink(root, path.join(outside, 'back'), 'dir'),
      fs.ensureSymlink(path.join(root, 'folder'), path.join(root, 'internal-link'), 'dir'),
      fs.ensureSymlink(root, path.join(root, 'root-link'), 'dir'),
      fs.symlink(path.join(outside, 'missing'), path.join(root, 'dangling'), 'dir'),
    ]);
    let configuredRoot = test.relativeRoot ? path.relative(process.cwd(), root) : root;
    if (test.rootAlias) {
      configuredRoot = path.join(base, 'root-alias');
      await fs.ensureSymlink(root, configuredRoot, 'dir');
    }
    const app = express();
    const auth = test.auth ? { username: 'test-user', password: 'test-password' } : {};
    app.use((req, res, next) => authMiddleware(req, res, next, auth));
    app.use((req, res, next) => Promise.resolve(handler(req, res, {
      path: configuredRoot,
      deleteFile: test.deleteFile !== false,
      uploadFile: false,
    })).catch(next));
    server = http.createServer(app);
    await new Promise((resolve, reject) => {
      server.once('error', reject);
      server.listen(0, '127.0.0.1', resolve);
    });
    const file = typeof test.file === 'function' ? test.file({ outside }) : test.file;
    const query = test.query || `delete=true&file=${encodeURIComponent(file)}`;
    const response = await request(server, query, test.credentials);
    assert.equal(response.status, test.status, `${test.name}: ${response.body}`);
    assert.equal(await fs.readFile(path.join(outside, 'victim_dir', 'sentinel.txt'), 'utf8'), 'outside data');
    assert.equal(await fs.readFile(path.join(sibling, 'victim_dir', 'sentinel.txt'), 'utf8'), 'sibling data');
    assert.equal(await fs.readFile(path.join(root, 'keep.txt'), 'utf8'), 'keep data');
    if (test.removed) {
      await assert.rejects(fs.lstat(path.join(root, test.removed)), { code: 'ENOENT' });
    }
    if (test.status === 302) assert.equal(response.location, '/');
    console.log(`PASS ${test.name}`);
  } finally {
    if (server && server.listening) {
      await new Promise((resolve) => { server.close(resolve); });
    }
    await fs.remove(base);
  }
};

const run = async () => {
  for (let i = 0; i < cases.length; i += 1) {
    // Keep filesystem fixtures and HTTP servers isolated, including on assertion failures.
    await runCase(cases[i]); // eslint-disable-line no-await-in-loop
  }
  console.log(`${cases.length} deletion regression tests passed.`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
