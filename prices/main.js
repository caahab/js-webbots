http = require('http');


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

function getTables(text){
	return getDataAsArray(text,'<table','</table>');
};

function getRows(text){
	return getDataAsArray(text,'<tr ','</tr>');
};

function getColumns(text){
	return getDataAsArray(text,'<td ','</td>');
};

//
function getValue(text){
	start = text.indexOf('>');
	end = text.indexOf('</', start);
	data = text.substr(start+1,end-start-1);
	return data;
};

//
console.log('Started');
var prices = [];
http.get( 'http://www.webbotsspidersscreenscrapers.com/buyair/', (res) => {
  res.setEncoding('utf8');
  var rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
	  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
	  console.log('Extracting Data');
	  // Extract tables
	  vtable = getTables(rawData);
	  for ( idx = 0; idx < vtable.length; idx++){
	  		if ( vtable[idx].includes('Products For Sale') ){
	  			console.log('Contains prices');
	  			// Extract rows
	  			vRow = getRows( vtable[idx] );
	  			for ( ydx = 0; ydx < vRow.length; ydx++){
	  				vCols = getColumns(vRow[ydx]);
	  				if ( vCols.length > 4 ){
	  					console.log('##############Processing entry:'+prices.length+' ###################');
	  					prices.push({'ID' : getValue(vCols[0]),
	  								 'Name' : getValue(vCols[1]),
	  								 'Condition' : getValue(vCols[2]),
	  								 'Weight' : getValue(vCols[3]),
	  								 'Price' : getValue(vCols[4]),
	  					});
	  				}
	  			}
	  		}
	  }
    } catch (e) {
      console.error(e.message);
    }
	console.log(prices);
  });
});


