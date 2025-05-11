/*!
 * file: scripts/sync-back-to-project-settings.js
 *
 * Synchronizes project.settings.jsonc from package.json.
 */

import SettingsAccessor from "./include/settings-accessor.js";

const fieldsToSync = ["version", "devDependencies", "dependencies"];

function syncProjectSettings() {
	SettingsAccessor.validateAllFilesExistOrThrow()
	const packageJsonObj = SettingsAccessor.package;
	const projectSettingsObj = SettingsAccessor.projectSettings;

	/* Conditionally copy fields */
	let changed = false;
	fieldsToSync.forEach(field => {
		if (field in packageJsonObj) {
			const current = JSON.stringify(projectSettingsObj[field]);
			const incoming = JSON.stringify(packageJsonObj[field]);
			if (current !== incoming) {
				projectSettingsObj[field] = packageJsonObj[field];
				console.log(`✔ Updated '${field}'`);
				changed = true;
			}
		} else if (field in projectSettingsObj) {
			delete projectSettingsObj[field];
			console.log(`✘ Removed '${field}' (not in ${SettingsAccessor.packageFilename})`);
			changed = true;
		}
	});

	/* Stringify and write back as JSONC */
	if (changed) {
		SettingsAccessor.projectSettings = projectSettingsObj;
		SettingsAccessor.publishPackage = SettingsAccessor.preparePackageForPublish(SettingsAccessor.package); /* also update package to publish */
		console.log(`🔁 Synced ${SettingsAccessor.projectSettingsFilename} from ${SettingsAccessor.packageFilename}`);
	} else {
		console.log(`✅ "${SettingsAccessor.projectSettingsFilename}" and "${SettingsAccessor.publishPackageFilename}" are already up to date`);
	}
}

syncProjectSettings();