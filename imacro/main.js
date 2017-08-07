fs = require('fs');
exec = require('child_process');


//
var macroHeader =  '##########################################\n';
macroHeader += '# Header (defaults, etc.)\n';
macroHeader += '##########################################\n';
macroHeader += 'SET !TIMEOUT 240\n';
macroHeader += 'SET !ERRORIGNORE YES\n';
macroHeader += 'SET !EXTRACT_TEST_POPUP NO\n';
macroHeader += 'FILTER TYPE=IMAGES STATUS=ON\n';
macroHeader += 'CLEAR\n';
macroHeader += 'TAB T=1\n';
macroHeader += 'TAB CLOSEALLOTHERS\n';

//
// Extract information to fill iMacro
// DO YOUR BOT MAGIC
var macroText = macroHeader;
macroText += 'WAIT 3\n';
macroText += 'GOTO https://nodejs.org/api/child_process.html#child_process_child_process_spawn_command_args_options\n';
macroText += 'WAIT 8\n';
macroText += 'GOTO http://www.tropicalmba.com/getstartedqanda/\n';

//
// Write iMacro file
fs.writeFileSync('bottask.iim', macroText);

//
// Execute iMacro file
child = exec.spawn('firefox', ['http://run.imacros.net/?m=bottask.iim']);
child.on('error', (err) => {
  console.log('Failed to start child process.');
});
