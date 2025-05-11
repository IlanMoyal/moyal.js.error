/*!
 * File: scripts/include/portable.js
 */

export class Portability {
	static fixGlobal() {
		if (typeof globalThis === 'undefined') {
			(function() {
				if (typeof self !== 'undefined') {
					self.globalThis = self;
				} else if (typeof window !== 'undefined') {
					window.globalThis = window;
				} else if (typeof global !== 'undefined') {
					global.globalThis = global;
				} else {
					this.globalThis = this;
				}
			})();
		}
	}

	static exit(code) {
		if (typeof process !== 'undefined' && typeof process.exit === 'function') {
			process.exit(code);
		} else {
			try {
				window.__testExitCode = code;
				console.log(`[exit(${code})] simulated in browser`);
				// Optional: trigger DOM feedback
				document.body.style.backgroundColor = code === 0 ? 'green' : 'red';
			}
			catch {
			}
		}
	}

	/**
	 * Removes the specified keys from the specified sourceObject.
	 * 
	 * @param {Object} sourceObject - The source object.
	 * @param {(string | RegExp)[]} keysToRemove - Keys to remove (can be strings or RegExp patterns)
	 * @returns {Object} A new object ready missing the specified keys.
	 */
	static removeObjectKeys(sourceObject, keysToRemove) {
		const result = {};

		for (const [key, value] of Object.entries(sourceObject)) {
			let shouldRemove = false;

			for (const pattern of keysToRemove) {
				if (typeof pattern === "string") {
					if (key === pattern) {
						shouldRemove = true;
						break;
					}
				} else if (pattern instanceof RegExp) {
					if (pattern.test(key)) {
						shouldRemove = true;
						break;
					}
				}
			}

			if (!shouldRemove) {
				result[key] = value;
			}
		}

		return result;
	}
};

export default Portability;