/*!
 * scripts/include/settings-accessor.js
 *
 * Synchronizes package.json from build/package.template.jsonc and project.settings.jsonc
 */

import fs from "fs";
import path from "path";
import utils from "./utils.js";
import jsonc from "comment-json";
import { init_entries as __init_entries} from "./init-entries.js";
import Portability from "./portability.js";

const __root = utils.getRootDirectory();

 /* no scripts in publish version */
 const __publishedPackageKeysToRemove = ["scripts", "devDependencies", /^x-moyal-.*$/];
 
export default class SettingsAccessor {
	static #_packageTemplateFilename = __init_entries.packageTemplateFilename;
	static get packageTemplateFilename() { return this.#_packageTemplateFilename; }
	
	static #_projectSettingsFilename = __init_entries.projectSettingsFilename;
	static get projectSettingsFilename() { return this.#_projectSettingsFilename; }
	
	static #_packageFilename = __init_entries.packageFilename;
	static get packageFilename() { return this.#_packageFilename; }

	static #_publishPackageFilename = __init_entries.publishPackageFilename;
	static get publishPackageFilename() { return this.#_publishPackageFilename; }

	static #_packageTemplatePath;
	static get packageTemplatePath(){return this.#_packageTemplatePath;}

	static #_projectSettingsPath;
	static get projectSettingsPath(){return this.#_projectSettingsPath;}

	static #_packagePath;
	static get packagePath(){return this.#_packagePath;}

	static #_publishPackagePath;
	static get publishPackagePath(){return this.#_publishPackagePath;}

	static
	{
		this.#_packageTemplatePath = path.join(__root, this.#_packageTemplateFilename);
		this.#_projectSettingsPath = path.join(__root, this.#_projectSettingsFilename);
		this.#_packagePath = path.join(__root, this.#_packageFilename);
		this.#_publishPackagePath = path.join(__root, this.#_publishPackageFilename);
	}
	
	static get packageTemplateJson() {return fs.readFileSync(this.#_packageTemplatePath, "utf-8");}
	static set packageTemplateJson(pkg) {utils.writeJsonWithCommentsString(this.#_packageTemplatePath, pkg);}
	static get packageTemplate() {return jsonc.parse(this.packageTemplateJson);}
	static set packageTemplate(pkg) { utils.writeJsonWithComments(this.#_packageTemplatePath, pkg); }

	static get projectSettingsJson() {return fs.readFileSync(this.#_projectSettingsPath, "utf-8");}
	static set projectSettingsJson(settings) { utils.writeJsonWithCommentsString(this.#_projectSettingsPath, settings);}
	static get projectSettings() {return jsonc.parse(this.projectSettingsJson);}
	static set projectSettings(settings) { utils.writeJsonWithComments(this.#_projectSettingsPath, settings); }

	static get packageJson() {return fs.readFileSync(this.#_packagePath, "utf-8");}
	static set packageJson(pkg) {utils.writeJsonString(this.#_packagePath, pkg);}
	static get package() {return JSON.parse(this.packageJson);}
	static set package(pkg) { utils.writeJson(this.#_packagePath, pkg);}

	static get publishPackageJson() {return fs.readFileSync(this.#_publishPackagePath, "utf-8");}
	static set publishPackageJson(pkg) {utils.writeJsonString(this.#_publishPackagePath, pkg);}
	static get publishPackage() {return JSON.parse(this.publishPackageJson);}
	static set publishPackage(pkg) { utils.writeJson(this.#_publishPackagePath, pkg);}

	/**
	 * Prepares a copy of the package object for publishing
	 * by removing specified keys (string match or regex match).
	 * 
	 * @param {Object} packageJson - The original package.json object
	 * @param {(string | RegExp)[]} keysToRemove - Keys to remove (can be strings or RegExp patterns)
	 * @returns {Object} A new package object ready for publishing
	 */
	static preparePackageForPublish(packageJson) {
		return Portability.removeObjectKeys(packageJson, __publishedPackageKeysToRemove);
	}

	static validateAllFilesExistOrThrow() {
		if (!fs.existsSync(this.#_packageTemplatePath)) throw new Error("Missing package template.");
		if (!fs.existsSync(this.#_projectSettingsPath)) throw new Error("Missing project settings.");
		if (!fs.existsSync(this.#_packagePath)) throw new Error("Missing package.json.");
		if (!fs.existsSync(this.#_publishPackagePath)) throw new Error("Missing package.json.");
	}

	static allFilesExist() {
		return fs.existsSync(this.#_packageTemplatePath)
			&& fs.existsSync(this.#_projectSettingsPath)
			&& fs.existsSync(this.#_packagePath)
			&& fs.existsSync(this.#_publishPackagePath);
	}

	static createEmptyPackageIfNotExists(){
		utils.createFileIfNotExists(this.#_packagePath, "{}");
		utils.createFileIfNotExists(this.#_publishPackagePath, "{}");
	}

	static toObject() {
		return {
			template: this.packageTemplate,
			settings: this.projectSettings,
			pkg: this.package,
			publishPkg: this.publishPackage,
		};
	}
};