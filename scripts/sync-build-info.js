/*!
 * file: scripts/sync-build-info.js
 *
 * Synchronizes src/auto-generated/build-info.js from project.settings.jsonc
 */

import utils from "./include/utils.js";
import path from "path";
import fs from "fs";
import settingsAccessor from "./include/settings-accessor.js";

function syncBuildInfo() {
    const targetDir = path.join(utils.getRootDirectory(), settingsAccessor.projectSettings.sourceFolder, "auto-generated");
    const target = path.join(targetDir, "build-info.js");
    const buildInfo = 
`/**
* @module
* @ignore
* @internal
*/
/**
* @ignore
* @internal
*/
export default class BuildInfo {
    static version = "${settingsAccessor.projectSettings.version}";
}`;
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(target, buildInfo.trim() + "\n");
    console.log(`✅ Synchronized build info to ${target}`);
}

syncBuildInfo();