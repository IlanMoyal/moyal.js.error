/*!
 * file: scripts/generate-ts.js
 *
 */

import utils from "./include/utils.js";
import path from "path";
import SettingsAccessor from "./include/settings-accessor.js";
import fs from "fs";
import { execSync } from "child_process";


function generateTS() {
    const root = utils.getRootDirectory();
    let source = path.join(root, SettingsAccessor.tsconfig.compilerOptions.outDir, SettingsAccessor.projectSettings.sourceFile);
    source = utils.replaceEnding(source, ".js", ".d.ts");
    const targetFilename = SettingsAccessor.projectSettings.outputBaseFilename + ".d.ts";
    const target = path.join(root, SettingsAccessor.tsconfig.compilerOptions.outDir, targetFilename);
    
    execSync("tsc --project tsconfig.json", {stdio: "inherit"}); // generates the typescript with source name
    utils.renameFile(source, target);
    console.log(`✅ Type script file generated ${target}`);

    cleanFolderExcept(SettingsAccessor.tsconfig.compilerOptions.outDir, targetFilename);
}

/**
 * Deletes all files and subdirectories inside a folder,
 * except for the one file that should be kept.
 *
 * @param {string} folderPath - Path to the folder to clean.
 * @param {string} keepFileName - File name to keep (not full path).
 */
function cleanFolderExcept(folderPath, keepFileName) {
  if (!fs.existsSync(folderPath)) {
    console.error(`❌ Folder does not exist: ${folderPath}`);
    return;
  }

  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(folderPath, entry.name);

    if (entry.name === keepFileName) {
      continue;
    }

    try {
      if (entry.isDirectory()) {
        fs.rmSync(entryPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(entryPath);
      }
    } catch (err) {
      console.error(`❌ Failed to delete: ${entryPath}`, err);
    }
  }

  console.log(`✅ Cleaned '${folderPath}', kept only '${keepFileName}'`);
}


generateTS();