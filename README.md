<!-- This README.md was autogenerated by script. Edit build/README.content.md instead, and run `nmp run generateReadme` -->

# moyal.js.error 

[![license](https://img.shields.io/npm/l/@moyal/js-error)](https://github.com/IlanMoyal/moyal.js.error/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/@moyal/js-error)](https://www.npmjs.com/package/@moyal/js-error)
[![jsDelivr CDN](https://data.jsdelivr.com/v1/package/npm/@moyal/js-error/badge)](https://www.jsdelivr.com/package/npm/@moyal/js-error)
[![minzipped size](https://badgen.net/bundlephobia/minzip/@moyal/js-error)](https://bundlephobia.com/package/@moyal/js-error)

A modern, extensible JavaScript error class with native cause support, recursive serialization, full stack tracing, and developer-friendly utilities. Designed for structured logging and forward-compatible error handling in modern applications.

## Information
- **Current Version:** 1.0.2
- **Author:** Ilan Moyal
- **Website:** https://www.moyal.es
- **License:** MIT
- **NPM:** [https://www.npmjs.com/package/@moyal/js-error](https://www.npmjs.com/package/@moyal/js-error)
- **API Documentation:** [View online](https://IlanMoyal.github.io/moyal.js.error/)

## Table of Contents
- [Installation](#installation)
- [Importing](#importing)
- [Features](#features)
- [Quick Start](#quick-start)
- [Why Use moyal.js.error](#why-use-moyaljserror)
- [Compatibility](#compatibility)
- [Requirements](#requirements)
- [Version Access](#version-access)
- [License](#license)
- [Author](#author)

## Installation

> npm install @moyal/js-error

## Importing

### In Node.js (ES Module)

```js
import { MoyalError } from "@moyal/js-error";
```

### In Node.js (CommonJS)

```js
const { MoyalError } = require("@moyal/js-error");
```

### In the Browser (ES Module via CDN)

```html
<!-- From jsDelivr CDN (minified version) -->
<script type="module">
  import "https://cdn.jsdelivr.net/npm/@moyal/js-error@1.0.2/dist/moyal.error.umd.min.js";
</script>

<!-- From jsDelivr CDN (non minified version with documentation) -->
<script type="module">
  import "https://cdn.jsdelivr.net/npm/@moyal/js-error@1.0.2/dist/moyal.error.umd.js";
</script>
```

<!-- CONTENT -->
Or using **unpkg**:

```html
<script type="module">
  import "https://unpkg.com/@moyal/js-error@1.0.2/dist/moyal.error.umd.min.js";
</script>
```

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

For more code examples, see also **"/examples"** and (or) **"/test/units"** in [GitHub Repository](https://github.com/IlanMoyal/moyal.js.error).

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

## Version Access

Access the library version directly:
```js
import * as myLib from "@moyal/js-error";

myLib.Version // → e.g., "1.0.2"
```

## License

MIT License - free to use, modify, and distribute.

## Author: Ilan Moyal

> Website: [https://www.moyal.es](https://www.moyal.es)

> GitHub: [Ilan Moyal](https://github.com/IlanMoyal)

> LinkedIn: [Ilan Moyal](https://www.linkedin.com/in/ilanam)
