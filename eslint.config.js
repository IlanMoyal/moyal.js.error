import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { 
    files: ['src/**/*.{js,mjs,cjs}', 'test/**/*.{js,mjs,cjs}', 'build/**/*.{js,mjs,cjs}'], 
    plugins: { js }, 
    extends: ["js/recommended"] 
  },
  { 
    files: ['src/**/*.{js,mjs,cjs}', 'test/**/*.{js,mjs,cjs}', 'build/**/*.{js,mjs,cjs}'], 
    languageOptions: { 
      globals: {
        moyal: 'writable', /* remove any  error of the kind: "error  'moyal' is not defined  no-undef" */
        ...globals.browser, 
        ...globals.node
      } 
    } 
  },
  { 
    files: ['test/**/*.{js,mjs,cjs}'], 
    rules: {
      'no-unused-vars': ['warn', { 
        varsIgnorePattern: '^unused__',
        argsIgnorePattern: '^unused__'
      }]
    }     
  }
]);