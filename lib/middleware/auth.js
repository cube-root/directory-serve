const authMiddleware = (req, res, next, auth) => {
  if (!auth || Object.keys(auth).length === 0 || !auth.username) {
    return next();
  }
  // parse login and password from headers
  const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
  const [username, password] = Buffer.from(b64auth, 'base64').toString().split(':');

  if (username && username === auth.username
    && (!auth.password || (password && password === auth.password))) {
    return next();
  }

  res.set('WWW-Authenticate', 'Basic realm="401"');
  return res.status(401).send('Authentication required.');
};
module.exports = {
  authMiddleware,
};
