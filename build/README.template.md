<!-- 
README Template
Placeholders: {{...}} from project.settings.jsonc
Dynamic blocks: {{::command:...::}} resolved at generation time
-->

# {{project:fullname}} 

[![license](https://img.shields.io/npm/l/{{scope}}/{{lib}})](https://github.com/{{git:username}}/{{git:repository-name}}/blob/master/LICENSE)
[![npm version](https://img.shields.io/npm/v/{{scope}}/{{lib}})](https://www.npmjs.com/package/{{scope}}/{{lib}})
[![jsDelivr CDN](https://data.jsdelivr.com/v1/package/npm/{{scope}}/{{lib}}/badge)](https://www.jsdelivr.com/package/npm/{{scope}}/{{lib}})
[![minzipped size](https://badgen.net/bundlephobia/minzip/{{scope}}/{{lib}})](https://bundlephobia.com/package/{{scope}}/{{lib}})

{{description}}

## Information
- **Current Version:** {{version}}
- **Author:** {{author}}
- **Website:** {{author:website}}
- **License:** {{license}}
- **NPM:** [https://www.npmjs.com/package/{{scope}}/{{lib}}](https://www.npmjs.com/package/{{scope}}/{{lib}})
- **API Documentation:** [View online](https://{{git:username}}.github.io/{{git:repository-name}}/)

## Table of Contents
- [Installation](#installation)
- [Importing](#importing)
{{::readme-content:toc::}}
- [Version Access](#version-access)
- [License](#license)
- [Author](#author)

## Installation

> npm install {{scope}}/{{lib}}

## Importing

### In Node.js (ES Module)

```js
import { {{exampleExportedName}} } from "{{scope}}/{{lib}}";
```

### In Node.js (CommonJS)

```js
const { {{exampleExportedName}} } = require("{{scope}}/{{lib}}");
```

### In the Browser (ES Module via CDN)

```html
<!-- From jsDelivr CDN (minified version) -->
<script type="module">
  import "https://cdn.jsdelivr.net/npm/{{scope}}/{{lib}}@{{version}}/dist/{{outputBaseFilename}}.umd.min.js";
</script>

<!-- From jsDelivr CDN (non minified version with documentation) -->
<script type="module">
  import "https://cdn.jsdelivr.net/npm/{{scope}}/{{lib}}@{{version}}/dist/{{outputBaseFilename}}.umd.js";
</script>
```

<!-- CONTENT -->
Or using **unpkg**:

```html
<script type="module">
  import "https://unpkg.com/{{scope}}/{{lib}}@{{version}}/dist/{{outputBaseFilename}}.umd.min.js";
</script>
```

{{::readme-content::}}

## Version Access

Access the library version directly:
```js
import * as myLib from "{{scope}}/{{lib}}";

myLib.Version // → e.g., "{{version}}"
```

## License

{{license:short-text}}

## Author: {{author}}

> Website: [{{author:website}}]({{author:website}})

> GitHub: [{{author}}](https://github.com/{{git:username}})

> LinkedIn: [{{author}}](https://www.linkedin.com/in/{{author:linkedin:username}})