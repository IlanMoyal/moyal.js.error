/*!
 * File: examples/examples-01.js
 */

import { MoyalError } from "../src/index.js"; // replace with "@moyal/js-error" when consuming from NPM.
MoyalError.extendNativeError(); /* extends native `Error` class with `toJSON` function */

try {
    try {
        throw new Error("Root failure");
    } catch (inner) {
        throw new MoyalError("Wrapping error", { cause: inner });
    }
} catch (err) {
    console.log(err.toString());
    console.log(err.fullStack);
    console.log(JSON.stringify(err.toJSON(), null, 2));
}

/*
Output (formatted):

MoyalError: Wrapping error
    at ...
Caused by...
    Error: Root failure
        at ...

And JSON output:

{
  "name": "MoyalError",
  "message": "Wrapping error",
  "stack": "...",
  "timestamp": "2025-05-09T...",
  "cause": {
    "name": "Error",
    "message": "Root failure",
    ...
  },
  "type": "MoyalError"
}

Note: If we don't call MoyalError.extendNativeError(), the inner error (cause) won't be serialized properly — it will appear as {} in the JSON output.

*/

