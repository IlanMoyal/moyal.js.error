/*!
 * File: scripts/version-post.js
 */
import utils from "./include/utils.js";
import { execSync } from "child_process";

// Generate docs
execSync('npm run docs', { stdio: "inherit" });

// Conditionally commit README
utils.conditionallyCommitFile("README.md", "📚 Update README after version bump");
utils.conditionallyCommitDirectory("docs", "📚 Update docs folder after version bump")

// 
execSync("git push && git push --tags && echo ✅ All pushed", { stdio: "inherit" });
