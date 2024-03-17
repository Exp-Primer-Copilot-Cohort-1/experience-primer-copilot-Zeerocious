// Create web server
var http = require('http');

// Create web server
http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello world\n');
}).listen(3000, ');