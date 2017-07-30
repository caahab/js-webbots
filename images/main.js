http = require('https');
fs = require('fs');
request = require('request');

//
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
//
function getAttribute(text, tag){
	start = text.indexOf(tag);
	end = text.indexOf('" ', start);
	data = text.substr(start+tag.length+2,end-start-tag.length-2);
	return data;
};

//
function createDirectories(srcFile){
	dirs = srcFile.split('/');
	fullPath = './images';
	//
	if ( dirs.length < 4 )
		return {};
	if ( !fs.existsSync( fullPath ) )
		fs.mkdirSync( fullPath );
	//
	for (idy=3; idy <(dirs.length-1) ;idy++){
		fullPath += '/'+dirs[idy];
		if ( !fs.existsSync( fullPath ) ){
			fs.mkdirSync( fullPath );
		}
	}
	//
	//console.log( fullPath );
	return {url: srcFile, path: (fullPath+dirs[dirs.length-1])}
};

//
var download = function(uri,filename,callback){
	request.head(uri, function(err, res, body){
		request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
	});
};
//
function downloadImages(urls){
	for (idz=0; idz < urls.length; idz++){
		pair = urls[idz];
		if ( !fs.existsSync(pair.path)){
			download( pair.url, pair.path, function(){
				console.log('Done downloading: ' + pair.url);
			});
		}
	}
};
//
console.log('Started');
http.get( 'https://www.pinterest.com/pin/239183430188569979/', (res) => {
	res.setEncoding('utf8');
	var rawData = '';
	res.on('data', (chunk) => { rawData += chunk; });
	res.on('end', () => {
		try {
			console.log('Extracting Data');
			// Extract images
			var images = [];
			vtable = getDataAsArray(rawData,'<img','/>');
			console.log( 'Number of images on page: ' + vtable.length);
			for ( idx = 0; idx < vtable.length; idx++){
				imageSrc = getAttribute( vtable[idx], 'src');
				//
				images.push( createDirectories(imageSrc) );
			}
			//
			downloadImages(images);
		} catch (e) {
			console.error(e.message);
		}
	});
});
