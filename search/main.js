http = require('https');

//
//
searchEngine = 'https://www.google.ch';
term = '/search?q=webbots';
target = 'www.hackerrank.com';
var nCounter = 0;
var nPageClock = 10;
var previousPage = '';

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
function getAttribute(text, tagOpen, tagClose){
	start = text.indexOf(tagOpen);
	end = text.indexOf(tagClose, start);
	data = text.substr(start+tagOpen.length+2,end-start-tagOpen.length-2);
	return data;
};

//
//
function targetOnPage(link){
	return link.includes(target);
};
function followUpPage(){
	var nextPage = '&start=' + nPageClock + '&sa=N';
	nPageClock += 10;
	nCounter++;
	return (term + nextPage);
};

//
//
function loadSearchPageWithWait(link){
	setTimeout(function(){
		loadSearchPage(link);
	}, Math.random()*3000+3000);
};

function loadSearchPage(link){
	if ( nCounter >= 5 ){
		console.log('Did not find target ' + target + ' for search term ' + term);
		return -1;
	}
	//
	const options = {
		hostname: 'www.google.ch',
		path: link,
		method: 'GET',
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 6.1;) Gecko/20100101 Firefox/13.0.1',
			'Referer': previousPage
		}
	};
	//
	http.get( options, (res) => {
		console.log('Searching on page: ' + link);
		console.log(res.statusCode);
		console.log(res.headers);

		res.setEncoding('utf8');
		//
		var rawData = '';
		res.on('data', (chunk) => { rawData += chunk; });
		res.on('end', () => {
			vtable = getDataAsArray(rawData,'<a','>');
			for (var i = 0; i < vtable.length; i++) {
				targetLinks = getAttribute( vtable[i], 'href', '">')
				found = targetOnPage( targetLinks );
				if ( found ){
					console.log('Found on page ' + nCounter + ' Rank ' + i);
					return -1;
				}
				else{
					nextPage = followUpPage();
					previousPage = searchEngine + term + link
					loadSearchPageWithWait( nextPage );
				}
			}
		});
	});
};

console.log('Start rank search!');
loadSearchPage( term );