/*!
* File: scripts/publish-switch.js
*/

import fs from "fs";
import SettingsAccessor from "./include/settings-accessor.js";
import { execSync } from "child_process";
import utils from "./include/utils.js";
import path from "path";

const PACKAGE_JSON = SettingsAccessor.packagePath;
const PACKAGE_PUBLISH_JSON = SettingsAccessor.publishPackagePath;
const PACKAGE_BACKUP_JSON = PACKAGE_JSON + ".publish-backup";
const README_PATH = path.join(utils.getRootDirectory(), "README.md");

function gitAssumeUnchanged(filePath) {
    execSync(`git update-index --assume-unchanged "${filePath}"`);
}

function gitNoAssumeUnchanged(filePath) {
    execSync(`git update-index --no-assume-unchanged "${filePath}"`);
}

async function copyOrFail(from, to) {
    try {
        await fs.promises.copyFile(from, to);
    } catch (error) {
        console.error(`Failed to copy: ${from} -> ${to}`);
        console.error(error);
        process.exit(1);
    }
}

async function renameOrFail(from, to) {
    try {
        await fs.promises.rename(from, to);
    } catch (error) {
        console.error(`Failed to rename: ${from} -> ${to}`);
        console.error(error);
        process.exit(1);
    }
}

async function publishSwitch() {
    console.log("📦 Switching to publish-ready package.json...");

    if (!fs.existsSync(PACKAGE_PUBLISH_JSON)) {
        console.error("❌ package.publish.json does not exist. Run 'npm run sync' first.");
        process.exit(1);
    }

    if (!fs.existsSync(PACKAGE_JSON)) {
        console.error("❌ package.json does not exist!");
        process.exit(1);
    }

    // Backup the development package.json
    await renameOrFail(PACKAGE_JSON, PACKAGE_BACKUP_JSON);

    // Move publish-ready package into place
    await renameOrFail(PACKAGE_PUBLISH_JSON, PACKAGE_JSON);

    // mark package.json as git-unchanged, so version command can work.
    gitAssumeUnchanged(PACKAGE_JSON);

    /* The readme was updated */
    gitAssumeUnchanged(README_PATH);

    console.log("✅ Switched package.json for publish.");
}

async function publishRestore() {
    console.log("📦 Restoring original development package.json...");

    if (!fs.existsSync(PACKAGE_BACKUP_JSON)) {
        console.error("❌ package.json.backup does not exist. Cannot restore.");
        process.exit(1);
    }

	// restore publish package
	await copyOrFail(PACKAGE_JSON, PACKAGE_PUBLISH_JSON);

    // Remove the published one (after publishing done)
    await fs.promises.unlink(PACKAGE_JSON);

    // Restore backup
    await renameOrFail(PACKAGE_BACKUP_JSON, PACKAGE_JSON);

    // clear the flag the mark package.json as git-unchanged.
    gitNoAssumeUnchanged(PACKAGE_JSON);

    // clear the flag the mark README.md as git-unchanged.
    gitNoAssumeUnchanged(README_PATH);

    console.log("✅ Restored original package.json.");
}

async function main() {
    const cmd = process.argv[2];
    if (cmd === "switch") {
        await publishSwitch();
    } else if (cmd === "restore") {
        await publishRestore();
    } else {
        console.error("❌ Unknown command. Use: 'switch' or 'restore'");
        process.exit(1);
    }
}

main();
