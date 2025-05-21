/*!
 * file: scripts/sync-package.js
 *
 * Synchronizes package.json from build/package.template.jsonc and project.settings.jsonc
 */

import SettingsAccessor from "./include/settings-accessor.js";
import jsonc from "comment-json";

function applyPackageTemplate(template, values) {
    template = JSON.stringify(jsonc.parse(template)); /* remove all comments */

    // Perform interpolation
    let publishInterpolated = "";
    let interpolated = template.replace(/{{([\w:-]+)}}/g, (_, key) => {
        return values[key] ?? `{{${key}}}`;
    });

    // === Replace "key": "::placeholder::" with full object ===
    interpolated = interpolated.replace(
        /"(\w+)":\s*"::placeholder::"/g,
        (_, key) => {
            if (!(key in values)) {
                throw new Error(`Missing value for placeholder key: ${key}`);
            }
            const json = JSON.stringify(values[key], null, 2); // Pretty-printed JSON
            return `"${key}": ${json}`;
        }
    );

    try {
        /* 
        * JSON.parse(interpolated) - Validate the output is still valid JSON 
        * JSON.stringify(...) - beautify the result
        */
       let pkg = JSON.parse(interpolated);
       interpolated = JSON.stringify(pkg, null, 2);
       
       /* no scripts in publish version */
       publishInterpolated = JSON.stringify(SettingsAccessor.preparePackageForPublish(pkg), null, 2);

    } catch (err) {
        throw new Error(`Interpolated package.json is invalid: ${err.message}`);
    }

    return {"packageJson": interpolated, "publishPackageJson": publishInterpolated};
}

function applyTsconfigTemplate(template, values) {
    template = JSON.stringify(jsonc.parse(template)); /* remove all comments */

    // Perform interpolation
    let publishInterpolated = "";
    let interpolated = template.replace(/{{([\w:-]+)}}/g, (_, key) => {
        return values[key] ?? `{{${key}}}`;
    });

    // === Replace "key": "::placeholder::" with full object ===
    interpolated = interpolated.replace(
        /"(\w+)":\s*"::placeholder::"/g,
        (_, key) => {
            if (!(key in values)) {
                throw new Error(`Missing value for placeholder key: ${key}`);
            }
            const json = JSON.stringify(values[key], null, 2); // Pretty-printed JSON
            return `"${key}": ${json}`;
        }
    );

    try {
        /* 
        * JSON.parse(interpolated) - Validate the output is still valid JSON 
        * JSON.stringify(...) - beautify the result
        */
       let obj = JSON.parse(interpolated);
       interpolated = JSON.stringify(obj, null, 2);
    } catch (err) {
        throw new Error(`Interpolated tsconfig.json is invalid: ${err.message}`);
    }

    return {"tsconfigJson": interpolated};
}

function syncPackageJson() {
    SettingsAccessor.validateAllFilesExistOrThrow();

    let json = applyPackageTemplate(SettingsAccessor.packageTemplateJson, SettingsAccessor.projectSettings); 
    SettingsAccessor.packageJson = json.packageJson;
    SettingsAccessor.publishPackageJson = json.publishPackageJson;
    console.log(`Synced ${SettingsAccessor.packageFilename} from ${SettingsAccessor.projectSettingsFilename} and ${SettingsAccessor.packageTemplateFilename}`);

    json = applyTsconfigTemplate(SettingsAccessor.tsconfigTemplateJson, SettingsAccessor.projectSettings); 
    SettingsAccessor.tsconfigJson = json.tsconfigJson;
    console.log(`Synced ${SettingsAccessor.tsconfigFilename} from ${SettingsAccessor.projectSettingsFilename} and ${SettingsAccessor.tsconfigTemplateFilename}`);
}

syncPackageJson();

