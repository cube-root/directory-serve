const directory = (req, res, { path } = {}) => {
    console.log('innn')
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        data: path
    }));
}


module.exports = {
    directory
}