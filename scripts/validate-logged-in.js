/*!
 * File: validate-logged-in.js
 */
import Portability from "./include/portability.js";
import utils from "./include/utils.js";

if(!utils.npmValidateLoggedIn())
	Portability.exit(1);
else
	Portability.exit(0);