http = require('http');
request = require('request');
socketio = require('socket.io');
fs = require('fs');

var sources = ['http://www.ft.com/rss/home/uk', 'http://www.startribune.com/rss/1557.xml', 'http://www.lasvegassun.com/feeds/headlines/all'];


// Load RSS feed & Update website
function getDataAsArray(data, tagOpen, tagClose){
	var tables = [];
	start = data.indexOf(tagOpen);
	//
	while( start != -1 ){
		end = data.indexOf(tagClose, start);
		tables.push( data.substr(start,end-start+tagClose.length) );
		start = data.indexOf(tagOpen, end);
	}

	return tables;
};
function stripCData(text){
	var newText = text.replace('<![CDATA[','');
	newText = newText.replace(']]>','');
	return newText;
}
function getValue(text, tag){
	start = text.indexOf('<'+tag+'>');
	end = text.indexOf('</'+tag+'>', start);
	data = text.substr(start+tag.length+2,end-start-tag.length-2);
	return stripCData(data);
};

function loadRssFeed( socket ){
	for (var i = sources.length - 1; i >= 0; i--) {
		request( sources[i] ).on( 'response', (response) => {
			//
			var rawData = '';
			response.on('data', (chunk) => { rawData += chunk; });
			response.on('end', () => {
				if (rawData){
					items = getDataAsArray( rawData, '<item', '</item>');
					for (var y = 0; y < items.length; y++){
						titel = getValue(items[y], 'title');
						date = getValue(items[y], 'pubDate');
						text = getValue(items[y], 'description');
						link = getValue(items[y], 'link');
						//
						if ( date )
							socket.emit( 'rssStump',{'title': titel, 'date': date, 'link': link, 'text': text} );
					}
				}
			});
		});
	}
};

// Setup server
var handler = function(req, res) {
	fs.readFile( './index.html', function(err, data){
		if (err){
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		else{
			res.writeHead(200);
			res.end(data);
		}
	});
};
var app = http.createServer(handler);
var io = socketio(app);

// Connect events
io.on('connection', function(socket){
	console.log('New client connection');
	loadRssFeed( socket );
});

app.listen(8000);
console.log('Server running');
