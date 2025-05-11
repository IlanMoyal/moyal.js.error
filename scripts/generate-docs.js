import path from "path";
import utils from "./include/utils.js";
import { execSync } from 'child_process';

utils.validateRunFromRoot();

const docsFolder = path.join(utils.getRootDirectory(), "docs");
utils.cleanDirectory(docsFolder);
execSync("npm run docs:readme", {stdio: "inherit"});
execSync("npm run docs:api", {stdio: "inherit"});

utils.cleanHtmlDocFooters(docsFolder);