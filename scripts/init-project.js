/*!
* File: scripts/init-workflow.js
* 
* Initializes the project's "package.json" file and the source file "src/auto-generated/build-info.js"
*/

import SettingsAccessor from "./include/settings-accessor.js";

SettingsAccessor.createEmptyPackageIfNotExists();

await import("./sync-package.js");
await import("./sync-build-info.js");
