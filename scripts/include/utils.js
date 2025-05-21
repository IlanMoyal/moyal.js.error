import "./portability.js";
import url from 'url';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import jsonc from "comment-json";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let __root = path.resolve(__dirname, '../..');
if(!fs.existsSync(path.join(__root, "project.settings.jsonc")))
	__root = null;

export default class utils {
	static getRootDirectory() {
		if(__root == null)
			throw new Error("utils.js must resides two levels under project root directory, usually ./scripts/include/utils.js");
		return __root;
	}

	static runCommand(cmd, wd, label) {
		try {
			console.log(`\n⏳ ${label}...`);
			execSync(cmd, { cwd: wd, stdio: 'inherit' });
			console.log(`✅ ${label} done.`);
		} catch {
			console.error(`❌ Failed: ${label}`);
			process.exit(1);
		}
	}

	/**
	 * Gets the directory of the calling file (not utils.js)
	 * @returns {string} Directory of the caller
	 */
	static getCallerDirname() {
		const origPrepareStackTrace = Error.prepareStackTrace;

		try {
			const err = new Error();
			Error.prepareStackTrace = (_, stack) => stack;
			const stack = err.stack;

			// stack[0] = this function (getCallerDirname)
			// stack[1] = who called this function (that's what we want!)
			const caller = stack[1]; 

			const callerFileUrl = caller.getFileName(); // full file path (with file:// if ESM)
			const filePath = callerFileUrl.startsWith('file://')
				? url.fileURLToPath(callerFileUrl)
				: callerFileUrl;

			return path.dirname(filePath);
		} finally {
			Error.prepareStackTrace = origPrepareStackTrace;
		}
	}

	static writeJsonString(target, jsonStr) {
		fs.writeFileSync(target, jsonStr.trim() + "\n");
	}

	static writeJson(target, obj) {
		this.writeJsonString(target, JSON.stringify(obj, null, 4));
	}

	static writeJsonWithCommentsString(target, jsoncStr) {
		fs.writeFileSync(target, jsoncStr.trim() + "\n");
	}

	static writeJsonWithComments(target, obj) {
		this.writeJsonWithCommentsString(target, jsonc.stringify(obj, null, 4));
	}

	/**
	* Creates a file with optional content if it does not already exist.
	* 
	* @param {string} filePath - Absolute or relative path to the file.
	* @param {string} content - Optional initial content to write (default: empty).
	*/
	static createFileIfNotExists(filePath, content = '') {
		const resolvedPath = path.resolve(filePath);
		if (!fs.existsSync(resolvedPath)) {
			fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
			fs.writeFileSync(resolvedPath, content);
		} 
	}	

	static npmGetLoggedInUser() {
		return execSync('npm whoami', { stdio: 'pipe' }).toString().trim();
	}

	static npmValidateLoggedIn() {
		try {
			const username = this.npmGetLoggedInUser();
			console.log(`🔑 Logged in as: ${username}`);
			return true;
		} catch {
			console.error('❌ Not logged in to npm. Please run: npm login');
			return false;
		}
	}

	static gitIsClean(includingUntracked){
		if(includingUntracked === true) {
			const status = execSync("git status --porcelain").toString();
			return status.trim() === "";
		}
		else {
			try {
				execSync("git rev-parse --verify HEAD", { stdio: "ignore" });
				execSync("git diff-index --quiet HEAD --", { stdio: "ignore" });
				
				return true;
			} catch {
				return false;
			}
		}
	}

	/**
	 * Checks if the Git repository has at least one commit.
	 * @returns {boolean} `true` if the repository has at least one commit, otherwise `false`.
	 */
	static gitHasCommits() {
		try {
			execSync("git rev-parse --verify HEAD", { stdio: "ignore" });
			return true;
		} catch {
			return false;
		}
	}

	static gitTagExists(tag) {
		try {
			const output = execSync(`git tag -l "${tag}"`).toString().trim();
			return output.length > 0;
		} catch {
			return false;
		}
	}

	/**
	 * Conditionally adds and commits a file if it has changed.
	 * @param {string} filePath - Path to the file (relative to repo root).
	 * @param {string} message - Commit message.
	 */
	static conditionallyCommitFile(filePath, message) {
		try {
			// Check if the file has changes compared to the index
			execSync(`git diff --quiet ${filePath}`);
			console.log(`✅ No changes in ${filePath}, skipping commit.`);
		} catch {
			// File has changes
			console.log(`📄 ${filePath} changed. Committing...`);
			execSync(`git add ${filePath}`);
			execSync(`git commit -m "${message}"`);
		}
	}

	/**
	 * Conditionally adds and commits files in a directory if any have changed.
	 * @param {string} dirPath - Path to the directory (relative to repo root).
	 * @param {string} message - Commit message.
	 */
	static conditionallyCommitDirectory(dirPath, message) {
		try {
			// Check if there are any changes in the directory
			execSync(`git diff --quiet ${dirPath}`);
			console.log(`✅ No changes in ${dirPath}, skipping commit.`);
		} catch {
			// There are changes in the directory
			console.log(`📂 Changes detected in ${dirPath}. Committing modified files...`);
			
			// Get list of modified files (including added, modified, deleted)
			const changedFiles = execSync(`git status --porcelain ${dirPath}`)
				.toString()
				.split('\n')
				.filter(line => line.trim() !== '')
				.map(line => line.slice(3)); // strip status (e.g., " M path/to/file")
			
			if (changedFiles.length === 0) {
				console.log(`⚠️ Detected changes but no files to commit in ${dirPath}.`);
				return;
			}

			console.log(`📝 Adding files:\n${changedFiles.join('\n')}`);
			
			// Add each changed file
			changedFiles.forEach(file => {
				execSync(`git add "${file}"`);
			});

			// Commit the changes
			execSync(`git commit -m "${message}"`);
		}
	}

	static cleanHtmlDocFooters(directory) {
		const files = fs.readdirSync(directory).filter(f => f.endsWith('.html'));
		files.forEach(file => {
			const filePath = path.join(directory, file);
			let content = fs.readFileSync(filePath, 'utf8');
			content = content.replace(/<footer>[\s\S]*?<\/footer>/, '<footer></footer>');
			fs.writeFileSync(filePath, content, 'utf8');
			console.log(`🧹 Cleaned footer in ${file}`);
		});
	}

	/**
	 * Cleans a directory by deleting all files and subdirectories inside it.
	 * Does NOT delete the directory itself.
	 * 
	 * @param {string} dirPath - The path to the directory to clean.
	 */
	static cleanDirectory(dirPath) {
		if (!fs.existsSync(dirPath)) {
			console.log(`⚠️ Directory ${dirPath} does not exist.`);
			return;
		}

		const entries = fs.readdirSync(dirPath);

		for (const entry of entries) {
			const fullPath = path.join(dirPath, entry);
			const stat = fs.lstatSync(fullPath);

			if (stat.isDirectory()) {
				// Recursively remove the directory and its contents
				fs.rmSync(fullPath, { recursive: true, force: true });
				console.log(`🗑️ Deleted directory: ${fullPath}`);
			} else {
				// Delete file
				fs.unlinkSync(fullPath);
				console.log(`🗑️ Deleted file: ${fullPath}`);
			}
		}

		console.log(`✅ Cleaned directory: ${dirPath}`);
	}

	/**
	 * Validates that the current working directory is the project root.
	 * If not, prints an error and exits.
	 */
	static validateRunFromRoot() {
		const cwd = process.cwd();  // current working directory
		const root = this.getRootDirectory();  // your known repo root

		const resolvedCwd = path.resolve(cwd);
		const resolvedRoot = path.resolve(root);

		if (resolvedCwd !== resolvedRoot) {
			console.error(`❌ Error: This script must be run from the project root directory.`);
			console.error(`   Expected: ${resolvedRoot}`);
			console.error(`   Got:      ${resolvedCwd}`);
			process.exit(1);
		} else {
			console.log(`✅ Running from the project root: ${resolvedRoot}`);
		}
	}

	/**
	 * Replaces a file extension or a specific string suffix with a new value.
	 *
	 * @param {string} filePath - The original file path or name.
	 * @param {string} matchEnding - The string to match at the end (e.g., '.js').
	 * @param {string} replacement - The string to replace it with (e.g., '.d.ts').
	 * @returns {string} - The updated file path.
	 */
	static replaceEnding(filePath, matchEnding, replacement) {
		if (filePath.endsWith(matchEnding)) {
			return filePath.slice(0, -matchEnding.length) + replacement;
		}
		return filePath;
	}

	/**
	 * Renames a file.
	 *
	 * @param {string} oldPath - The current path of the file.
	 * @param {string} newPath - The new desired path.
	 * @returns {Promise<void>}
	 */
	static renameFile(oldPath, newPath) {
		try {
			fs.renameSync(oldPath, newPath);
			console.log(`Renamed: ${oldPath} → ${newPath}`);
		} catch (err) {
			console.error(`Failed to rename ${oldPath}:`, err);
			throw err;
		}
	}
}
