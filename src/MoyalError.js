/*!
 * File: src/MoyalError.js
 */

const TAB_STR = "  ";

import BuildInfo from "./auto-generated/build-info.js";

/**
 * @typedef {object} MoyalErrorJSON
 * @property {string} name - The name of the error (usually the class name).
 * @property {string} message - The error message.
 * @property {string} timestamp - ISO 8601 timestamp of when the error was created.
 * @property {string | undefined} stack - The error's stack trace.
 * @property {MoyalErrorJSON | object | string | null} [cause] - The nested cause (recursively serialized if available).
 * @property {string} type - The actual class name (e.g., "MoyalError").
 */

/**
 * Custom error class with nested error support.
 * Automatically uses native `cause` if supported, otherwise simulates it.
 */
export class MoyalError extends Error {
	/**
	 * Returns the version of this library.
	 * 
	 * @returns {string} - The version of this library.
	 */
	static get version() { 
		return BuildInfo.version;
	}

    /**
     * @readonly 
     * @type {boolean} 
     */
	static #_supportsNativeCause = MoyalError.#_testCauseSupport();

    /**
	 * Tests if the current runtime supports native Error `cause` (ES2022).
	 * @returns {boolean}
	 */
	static #_testCauseSupport() {
		try {
			const test = new Error("test", { cause: new Error("inner") });
			return 'cause' in test;
		} catch {
			return false;
		}
	}

	/** @type {Error | undefined} */
	#_cause = undefined;

    /**@type {Date} */
    #_timestamp = new Date();

    /**
	 * Constructs a new MoyalError instance.
	 *
	 * @param {string} message - The error message.
	 * @param {object|Error|string|null} [second] - Either an object with `{ cause }`, or a direct cause/error.
	 */
	constructor(message = "No message description was set to this error.", second = null) {
		// Handle options object with { cause } explicitly
        const isOptionsObject = second && typeof second === 'object' && 'cause' in second;
        const cause = isOptionsObject ? second.cause : second;
        const restOptions = MoyalError.#_supportsNativeCause ? { cause } : undefined;
		
		// Call parent with cause if supported
		super(String(message), restOptions);

		this.name = new.target.name; // <- ensures 'MoyalError' instead of 'Error'

		// Fallback storage for cause
		if (!MoyalError.#_supportsNativeCause && cause instanceof Error) {
			this.#_cause = cause;
		}
	}

    /**
	 * Gets the cause of the error (native or simulated).
	 * @returns {Error | undefined}
	 */
	get cause() {
		return MoyalError.#_supportsNativeCause
			? super.cause
			: this.#_cause;
	}

    /**
	 * Returns a string representation of the error including chained causes.
	 * @returns {string}
	 */
	toString() {
		let s = this.#_toStringNonRecursive();
		const cause = this.cause;
		if (cause) {
			s += `\nCaused by...\n` + MoyalError.#_tabify(cause.toString());
		}
		return s;
	}

    /**
	 * Returns the error string without recursing into causes.
	 * @returns {string}
	 */
	#_toStringNonRecursive() {
		let s = this.name;
		if (this.message) s += `: ${this.message}`;
		if (this.stack) s += `\n${MoyalError.#_tabify(this.stack)}`;
		return s;
	}
    
    /**
     * Indents all lines with a tab.
     * @param {string} str
     * @returns {string}
     */
    static #_tabify(str) {
        return String(str).replace(/\n/g, `\n${TAB_STR}`);
    }

    /**
	 * Serializes the error into a JSON-friendly object, including metadata for structured logging.
	 *
	 * @returns {MoyalErrorJSON} A plain object with name, message, stack, timestamp, and cause.
	 */
	toJSON() {
		const cause = this.cause;
		return {
			name: this.name,
			type: this.constructor.name,
			timestamp: this.#_timestamp.toISOString(),
			message: this.message,
			stack: this.stack,
			cause: cause instanceof Error && typeof cause.toJSON === 'function'
				? cause.toJSON()
				: cause ?? null
		};
	}

    /**
     * Builds a full stack trace including all nested causes, recursively.
     *
     * @returns {string} A combined stack trace with each cause appended.
     */
    get fullStack() {
        let output = this.stack || "";
        let current = this.cause;
        while (current) {
            output += `\nCaused by: ${current.stack || current.message}`;
            current = current.cause;
        }
        return output;
    }

    /**
     * Builds a readable, indented summary of the cause chain.
     *
     * @param {Error} error - The error to trace.
     * @returns {string} A multiline string with each cause indented by depth.
     */
    static printCauseChain(error) {
        let lines = [];
        let depth = 0;
        while (error) {
            lines.push(`${TAB_STR.repeat(depth)}${error.name ?? 'Error'}: ${error.message ?? '(no message)'}`);
            error = error.cause;
            depth++;
        }
        return lines.join('\n');
    }

	/**
	 * Extends the native Javascript Error type to contain toJSON function.
	 */
	static extendNativeError() {
		if (!Error.prototype.toJSON) {
			Error.prototype.toJSON = function () {
				return {
					name: this.name,
					type: this.constructor.name,
					message: this.message,
					stack: this.stack,
					...(this.cause && { cause: this.cause })
				};
			};
		}
	}
}
