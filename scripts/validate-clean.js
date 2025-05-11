/*!
* File: scripts/validate-clean.js
*/

import utils from './include/utils.js';

if(!utils.gitIsClean()) {
	console.error("❌ Git working tree is dirty. Please commit or stash your changes before generating docs.");
	process.exit(1);
}
