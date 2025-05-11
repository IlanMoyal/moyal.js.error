/* 
 * File: scripts/build.js 
 */

import utils from "./include/utils.js";

console.log("🚀 Starting build...");

// Run steps
utils.runCommand('npm install', utils.getRootDirectory(), 'Installing dependencies');
utils.runCommand('npx rollup -c', utils.getRootDirectory(), 'Building package');

console.log("🎉 Build complete.");
