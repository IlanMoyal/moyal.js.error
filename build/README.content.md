<!-- TOC-SECTION-MARKER -->

- [Features](#features)
- [Quick Start](#quick-start)
- [Why Use moyal.js.error](#why-use-moyaljserror)
- [Compatibility](#compatibility)
- [Requirements](#requirements)
<!-- CONTENT-SECTION-MARKER -->

## Features

- Native cause Support: Utilizes ES2022's standardized error chaining with automatic fallback for older runtimes.
- Recursive toString and fullStack: View entire error chains clearly, including nested stack traces.
- Structured Logging Ready: Includes toJSON() method with name, timestamp, type, message, stack, and full cause serialization.
- Enable extending native Error type with toJSON() method with name, type, message, stack, and full cause serialization.
- Cause Chain Inspection: Built-in printCauseChain() for clean, indented cause inspection.
- Minimal & Self-contained: Zero dependencies. Works seamlessly in Node.js and modern browsers.
- Forward-Compatible Design: Fully embraces modern JavaScript error handling without legacy bloat.

## Quick Start

```js
import { MoyalError } from "@moyal/js-error";
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
```

For more code examples, see also **"/{{examplesFolder}}"** and (or) **"/{{testFolder}}/units"** in [GitHub Repository](https://github.com/{{git:username}}/{{git:repository-name}}).

## Why Use moyal.js.error
- Error chaining is now a standard — cause is part of modern JavaScript (ES2022+), and this library builds on it properly.
- Your errors deserve structure — cleanly formatted, timestamped, and serializable errors are easier to debug and analyze.
- Minimal, not minimalistic — it gives you everything you need (recursive stack, JSON, inspection) and nothing you don’t.
- Safe fallback — gracefully simulates cause for environments that don’t support it yet, without breaking anything.
- Framework-ready — integrate with loggers, API responses, or monitoring systems without needing adapters or custom serializers.
- Drop-in convenience — replace any native throw new Error(...) with throw new MoyalError(...) and gain all the benefits instantly.

## Compatibility

| Feature                   | Supported In                                                  | Notes                                                                 |
|---------------------------|---------------------------------------------------------------|-----------------------------------------------------------------------|
| **Native `cause`**        | ✅ Node.js ≥ 16.9<br>✅ Chrome ≥ 93<br>✅ Firefox ≥ 91<br>✅ Edge ≥ 93 | Full ES2022 support                                                    |
| **Fallback `cause`**      | ✅ Yes                                                        | Automatically simulated in older runtimes                             |
| **Stack Trace**           | ✅ Yes                                                        | Includes full `stack` plus recursive `fullStack` for nested errors    |
| **`toJSON()`**            | ✅ Yes                                                        | Includes `name`, `message`, `stack`, `timestamp`, `cause`, `type`     |
| **Module Format**         | ✅ ES Module                                                  | `"type": "module"` in `package.json`                                  |
| **Runtime Environments**  | ✅ Node.js<br>✅ Modern Browsers (ES2020+)                    | Full support recommended in ES2022+                                   |

## Requirements

- **Runtime**: ES2020+ (Node.js ≥ 14, modern browsers)
- **Native `cause`** support recommended for full functionality (Node.js ≥ 16.9 or equivalent browser)
- **Dependencies**: None – zero-dependency library
- **Module Format**: ES Module (importable in `"type": "module"` or via bundlers)

You can use it directly in modern JavaScript projects without any external libraries or polyfills.
