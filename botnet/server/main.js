http = require('http');
URL = require('url');

// Setup server
var handler = function(req, res) {
	console.log('New request received');
	console.log( 'Requested target:' + req.url );
	reqTarget = req.url;

	//
	var rawData = '';
	req.on('data', (chunk) => { rawData += chunk; });
	req.on('end', () => {
		//console.log( 'Data from client: ' + rawData );
		var response = '<task cmd="idl" time="1d"></task>';
		// Extract data from request TODO
		;
		// Verify version number and update if necessary TODO
		//reqTarget = '/update';
		;
		//
		if ( reqTarget == '/update'){
			// Build response TODO
			response = '<task cmd="update" prg="scrap_img" toVersion="1.3.0" payload="24242323c23423423c23fc223p23pc23cp23pc2p32c23pc2f3"></task>';
		}
		else if ( reqTarget == '/task'){
			// Build response TODO
			response = '<task cmd="exec" prg="scrap_img"></task>';
		}

		// Provide response
		res.writeHead(200);
		res.end(response);
	});
};
var app = http.createServer(handler);

app.listen(8000);
console.log('Server running');
