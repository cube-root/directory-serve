const appendSlash = (str) => (str[str.length - 1] === '/' ? str : `${str}/`);

module.exports = {
  appendSlash,
};
