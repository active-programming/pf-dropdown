const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 9101;
const allItems = JSON.parse(fs.readFileSync(__dirname + '/countries.json', 'utf8'));


http.createServer((request, response) => {
    let req = url.parse(request.url, true);
    if (req.pathname == '/get-items') {
        if (req.query.term) {
            console.log('requested term = ' + req.query.term);
            let result = [];


            console.log('result items:', result);
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(result));
            return;
        } else {

        }
    }
    response.end('Hello Node.js Server!');
}).listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});