/**
 * file: scripts/version-current.js
 */

import SettingsAccessor from "./include/settings-accessor.js";
import { execSync } from 'child_process';

function main() {
    const version = SettingsAccessor.package.version; 
    console.log(`🏷️ Running npm version --allow-same-version v${version}`);
    //execSync(`npm version ${version}`, { stdio: "inherit" });    
    execSync(`npm version ${version} --allow-same-version`, { stdio: "inherit" });    
}

main();
