http = require('http');
curl = require('curl');
url = require('url');

//
//
target = 'http://www.webbotsspidersscreenscrapers.com/page_with_broken_links.php';
base = 'http://www.webbotsspidersscreenscrapers.com/';

//
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
function getAttribute(text, tag){
	start = text.indexOf(tag);
	end = text.indexOf('">', start);
	data = text.substr(start+tag.length+2,end-start-tag.length-2);
	return data;
};

//
//
function resolveLink(link, base){
	if ( !link.includes('www.') && !link.includes('http')){
		newLink = url.resolve(base,link);
		return newLink;
	}
	else if ( !link.includes('http')){
		newLink = 'http://' + link;
		return newLink;
	}
	return link;
};
function testLink(link){
	curl.get( link, {CURLOPT_REFERER: base}, function(err, res, body){
		console.log('##############');
		if ( res ){
			console.log('Url: '+link);
			console.log('Status: '+res.statusCode);
			console.log('Status Msg: '+res.statusMessage);			
		}
		else{
			console.log('Unreachable Url: '+link);
		}
	});
};

//
//
console.log('Start link check!');
http.get( target, (res) => {
	res.setEncoding('utf8');
	//
	var rawData = '';
	res.on('data', (chunk) => { rawData += chunk; });
	res.on('end', () => {
		vtable = getDataAsArray(rawData,'<a','>');
		for (var i = vtable.length - 1; i >= 0; i--) {
			link = getAttribute( vtable[i], 'href')
			link = resolveLink( link, base );
			testLink( link );
		}
	});
});
