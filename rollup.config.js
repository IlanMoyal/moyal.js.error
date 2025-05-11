/*!
 * File: rollup.config.js 
 */

import terser from '@rollup/plugin-terser';
import settingsAccessor from "./scripts/include/settings-accessor.js";
const __projectSettings = settingsAccessor.projectSettings;

const __terserBanner = `/*!
 * ${__projectSettings.scope}/${__projectSettings.lib} v${settingsAccessor.package.version}
 * (c) 2000–present Ilan Moyal
 * Released under the ${__projectSettings.license} License
 */`;

 const __minifyingTerser = terser({
	format: {
	  comments: false,  // remove all comments
	  preamble: __terserBanner // but inject this one
	}
});

const __outputFormats = {
	/* UMD - For regular script tag */
	"umd": [{
		"extension": "umd.js", 
		"plugins": []
	}, {
		"extension": "umd.min.js", 
		"plugins": [__minifyingTerser]
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
const outputFolder = settingsAccessor.projectSettings.outputFolder ?? "./dist";
const baseFilename = settingsAccessor.projectSettings.outputBaseFilename;
const exposedName = settingsAccessor.projectSettings.outputExposedName;

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

		output.push(config);
	}
} 

export default output;