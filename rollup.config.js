/*!
 * File: rollup.config.js 
 */

import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import SettingsAccessor from "./scripts/include/settings-accessor.js";
const __projectSettings = SettingsAccessor.projectSettings;

const __terserBanner = `/*!
 * ${__projectSettings.scope}/${__projectSettings.lib} v${SettingsAccessor.package.version}
 * (c) 2000–present Ilan Moyal
 * Released under the ${__projectSettings.license} License
 */`;

 const __minifyingTerser = terser({
	format: {
	  comments: false,  // remove all comments
	  preamble: __terserBanner // but inject this one
	}
});

const __externalLibs = [
  ...Object.keys(__projectSettings.dependencies ?? {}),
  ...Object.keys(__projectSettings.peerDependencies ?? {})
];

const __outputFormats = {
	/* UMD - For regular script tag */
	"umd": [{
		"extension": "umd.js", 
		"plugins": [resolve(), commonjs()]
	}, {
		"extension": "umd.min.js", 
		"plugins": [resolve(), commonjs(), __minifyingTerser]
	}],
	/* ESM - For module style */
	"es": [{
		"extension": "mjs", 
		"plugins": []
	}, {
		"extension": "min.mjs", 
		"plugins": [__minifyingTerser]
	}],
	/* CJS - For NodeJS common JS */
	"cjs": [{
		"extension": "cjs.js", 
		"plugins": []
	}, {
		"extension": "cjs.min.js", 
		"plugins": [__minifyingTerser]
	}]
};

const output = [];

const sourceFile = `${(__projectSettings.sourceFolder ?? "src")}/${(__projectSettings.sourceFile ?? "index.js")}`;
const outputFolder = SettingsAccessor.projectSettings.outputFolder ?? "./dist";
const baseFilename = SettingsAccessor.projectSettings.outputBaseFilename;
const exposedName = SettingsAccessor.projectSettings.outputExposedName;

for (const [format, outputVariations] of Object.entries(__outputFormats)) {
	for (const variation of outputVariations) {
		const outputFile = `${outputFolder}/${baseFilename}.${variation.extension}`;

		const config = {
			input: sourceFile,
			output: {
				file: outputFile,
				format
			},
			plugins: variation.plugins
		};
		
		if (format === "umd") {
			config.output.name = exposedName;
		}
		else {
			config.external = __externalLibs;
		}

		output.push(config);
	}
} 

export default output;