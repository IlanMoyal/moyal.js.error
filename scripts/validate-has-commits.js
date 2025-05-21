/*!
* File: scripts/validate-clean.js
*/

import utils from './include/utils.js';

if(!utils.gitHasCommits()) {
	console.error("❌ No commits found in this Git repository.");
	process.exit(1);
}
