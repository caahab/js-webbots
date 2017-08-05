curl = require('request');
//curl.debug = true;


function basicAuthentication(){
	target = 'http://www.WebbotsSpidersScreenScrapers.com/basic_authentication/index.php';
	curl.get( target, {	'auth': {
					    'user': 'webbot',
					    'pass': 'sp1der3',
					    'sendImmediately': false}},
					function(err, res, body){
		console.log('############## BASIC');
		if ( res ){
			console.log('Body: ' + res.statusCode);
		}
		else{
			console.log('Unreachable Url: '+target);
		}
	});
};


function cookieAuthentication(){
	target = 'http://www.WebbotsSpidersScreenScrapers.com/cookie_authentication/index.php';
	base = 'http://www.WebbotsSpidersScreenScrapers.com/query_authentication';
	curl.post( {url: target, followAllRedirects: true, formData: {enter:'Enter',username:'webbot',password:'sp1der3'}, jar: true}, function(err2, res2, body2){
		console.log('############## COOKIE');
		if ( res2 ){
			console.log('Post status: ' + res2.statusCode);
			console.log('Cookie: ' + JSON.stringify(res2.request['headers']['cookie']) );
		}
		else{
			console.log('Unreachable Url: '+target);
		}
	});		
};

//, {headers: {
//    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1;) Gecko/20100101 Firefox/13.0.1',
//    'Referer': base
//  }}
function queryAuthentication(){
	target = 'http://www.WebbotsSpidersScreenScrapers.com/query_authentication/index.php';
	base = 'http://www.WebbotsSpidersScreenScrapers.com/query_authentication';
	curl.post( {url: target, followAllRedirects: true, formData: {enter:'Enter',username:'webbot',password:'sp1der3'}, headers: {'Referer': base}}, function(err2, res2, body2){
		console.log('############## QUERY');
		if ( res2 ){
			console.log('Post status: ' + res2.statusCode);
			console.log('Session id: ' + res2.request['uri']['query']);
		}
		else{
			console.log('Unreachable Url: '+target);
		}
	});		
};


//
//
basicAuthentication();

//
//
cookieAuthentication();

//
//
queryAuthentication();
