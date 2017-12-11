const http = require('http');
const fs = require('fs');
const url = require('url');
const port = 3210;
const allItems = JSON.parse(fs.readFileSync(__dirname + '/countries.json', 'utf8'));


http.createServer((request, response) => {
    let req = url.parse(request.url, true);
    if (req.pathname == '/get-items') {
        if (req.query.term) {
            let term = req.query.term.toLowerCase();
            console.log('requested term = ' + term);
            let result = [];
            for (let item of allItems) {
                if (item.country_name.toLowerCase().indexOf(term) >= 0) {
                    result.push({
                        country_name: item.country_name,
                        country_code: item.country_code,
                        data: {
                            dialling_code: item.dialling_code
                        }
                    });
                }
            }
            console.log('result items:', result);
            response.setHeader('Access-Control-Allow-Origin', '*');
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