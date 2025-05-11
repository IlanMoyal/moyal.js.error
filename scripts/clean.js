/* 
* File: scripts/clean.js 
*/

import fs from "fs";
import path from "path";
import utils from "./include/utils.js";
import settingsAccessor from "./include/settings-accessor.js";

const outputFolderName = settingsAccessor.projectSettings.outputFolder ?? "./dist";
const outputFolderPath = path.join(utils.getRootDirectory(), outputFolderName);

try {
	if (fs.existsSync(outputFolderPath)) {
		fs.rmSync(outputFolderPath, { recursive: true, force: true });
		console.log(`✅ Cleaned folder: ${outputFolderPath}`);
	} else {
		console.log("ℹ️ Output folder not found:", outputFolderPath);
	}
} catch (err) {
	console.error(`❌ Failed to clean folder ${outputFolderPath}:`, err.message);
	process.exit(1);
}