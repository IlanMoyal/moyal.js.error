/*!
* scripts/test.js
*/

import fs from 'fs';
import path from 'path';
import url from 'url';
import utils from "./include/utils.js";
import settingsAccessor from "./include/settings-accessor.js";

const testFolder = settingsAccessor.projectSettings.testFolder ?? "test";
const runnerPath = path.join(utils.getRootDirectory(), `${testFolder}/runner.js`);

if (!fs.existsSync(runnerPath)) {
  console.error(`❌ Runner not found: ${runnerPath}`);
  process.exit(1);
}

console.log(`▶ Running test runner at: ${runnerPath}`);

import(url.pathToFileURL(runnerPath).href).catch((err) => {
  console.error("Failed to run test runner:", err);
  process.exit(1);
});
