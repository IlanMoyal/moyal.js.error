/*!
* scripts/version-release.js
*/

import { execSync } from 'child_process';
import utils from "./include/utils.js";
import settingsAccessor from "./include/settings-accessor.js";

const __root = utils.getRootDirectory();

// Check git status is clean
function ensureGitClean() {
  if (!utils.gitIsClean()) {
      console.error("❌ Git working tree is dirty! Commit or stash changes before releasing.");
      process.exit(1);
  }
}

function smartReleaseVersion() {
  ensureGitClean();

  const currentVersion = settingsAccessor.package.version;
  
  if (!currentVersion) {
    console.error("❌ Failed to read version from package.json");
    process.exit(1);
  }

  const isPrerelease  = /-\w+\.\d+$/.test(currentVersion);
  const finalVersion = currentVersion.replace(/-\w+\.\d+$/, '');

  console.log(`📦 Current version: ${currentVersion}`);
  if (isPrerelease ) {
	console.log(`🔁 Finalizing prerelease → ${finalVersion}`);
    execSync(`npm version --no-git-tag-version ${finalVersion}`, {
      cwd: __root,
      stdio: 'inherit',
    });
  } else {
    console.log('⏫ Bumping patch version...');
    execSync(`npm version patch`, {
      cwd: __root,
      stdio: 'inherit',
    });
  }
}

smartReleaseVersion();
