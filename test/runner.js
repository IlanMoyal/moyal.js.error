/* 
 * File: runner.js
 *
 * This runner can be run from both browser or node.
 * However, under Node environment it is better to execure runner-for-node.js
 */

import { MultiLevelAutoNumbering } from "@moyal/js-test";

import { Portability } from "../scripts/include/portability.js";

/* Good practice - use automatic test numerator */
const mlAutoNumber = new MultiLevelAutoNumbering();

/* Loads the test and run each of them, one by one */
import testSettings from "./settings.js";
const testUnits = testSettings.unitTests;
const list = testUnits.list;
Promise.all(list.map(path => import(`${testUnits.basePath}/${path}`)))
    .then(modules => {
        let hasFailure = false;

        for (const mod of modules) {
            const test = mod.default;

            try {
                const result = test.run(testSettings.writeMode, mlAutoNumber);
                
                /* If test.run returns a boolean or result object */
                if (result === false) 
                    hasFailure = true;

            } catch (err) {
                console.error(`Error while running test: ${err}`);
                hasFailure = true;
            }
			if(hasFailure)
				break;
        }
        Portability.exit(hasFailure ? 1 : 0);
    })
    .catch(err => {
        console.error("Failed to load tests:", err);
        Portability.exit(1);
    });