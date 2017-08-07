http = require('http');

// Setup server
var handler = function(req, res) {
	//
	var rawData = '';
	req.on('data', (chunk) => { rawData += chunk; });
	req.on('end', () => {
		console.log( 'Request Body: ' + JSON.stringify(rawData) );
	});
	//
	res.writeHead(200);
	res.end( '------------------ Received ------------------' );
	//
	console.log('Request Header: '+JSON.stringify(req.headers));
	console.log('Caller ip: '+req.socket.remoteAddress);
	console.log('Caller port: '+req.socket.remotePort);
};

var app = http.createServer(handler);
app.listen(8000);
console.log('Server running');
