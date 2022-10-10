const appendSlash = (str) => {
    return str[str.length - 1] === '/' ? str : str + '/'
}

module.exports = {
    appendSlash
}