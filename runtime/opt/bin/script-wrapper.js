#!/usr/bin/env node

/*
	script-wrapper takes a npm run-script style command and interprets it using node.
	This allows using simple npm scripts in containers which do have a shell available.

	
*/

const { spawnSync } = require('child_process');

if (process.argv.length != 4) {
	console.error(`script-wrapper: Unexpected argument length: ${process.argv.length}`);
	return;
}

let script = process.argv.pop();

if (!script.startsWith("node ")) {
	console.error(`script-wrapper: Only node-based script commands are accepted: ${script}`);
	return;
}

script = script.substring(5);

console.log(`script-wrapper: Executing script ${script}`);

const subprocess = spawnSync(process.argv[0], script.split(' '), {
	detached: true,
	stdio: 'inherit'
}).unref();