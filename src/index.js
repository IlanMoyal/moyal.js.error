﻿/*!
 * @moyal/js-error - A modern, extensible JavaScript error class with native cause support.
 *
 * File: moyal.linq.js
 * Repository: https://github.com/IlanMoyal/moyal.js.error
 * Author: Ilan Moyal (https://www.moyal.es)
 * Contact: ilan.amoyal[guess...what]gmail.com
 *
 * Description:
 * A modern, extensible JavaScript error class with native cause support, recursive 
 * serialization, full stack tracing, and developer-friendly utilities. Designed for 
 * structured logging and forward-compatible error handling in modern applications.
 * 
 * License:
 * MIT License – Permission is granted for free use, modification, and distribution,
 * provided that the copyright notice and license appear in all copies.
 * Full license text: https://opensource.org/licenses/MIT
 *
 * © 2000–present Ilan Moyal. All rights reserved.
 */

const TAB_STR = "  ";

import { isString } from "@moyal/js-type";
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
 * Returns the semantic version of this library.
 * @returns {string} - The semantic version of this library.
 */
export function version() { return BuildInfo.version; }

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
		const isOptionsObject = second && !(second instanceof Error) && typeof second === 'object' && 'cause' in second;
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
}

/**
 * Builds a readable, indented summary of the cause chain.
 *
 * @param {Error} error - The error to trace.
 * @returns {string} A multiline string with each cause indented by depth.
 */
export function printCauseChain(error) {
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
export function extendNativeError() {
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

/**
 * Represents an error caused by invalid or missing function arguments.
 * Inherits from `MoyalError`.
 *
 * @extends {MoyalError}
 */
export class ArgumentError extends MoyalError {
	/** @type {string|null} @private */
	#_argumentName = null;
	
	/**
	 * Constructs a new ArgumentError.
	 *
	 * @param {string} message - The error message.
	 * @param {string} [argumentName] - The name of the argument that caused the error.
	 */
	constructor(message, argumentName) {
		super(message);
		this.#_argumentName = argumentName;
	}
	
	/**
	 * Gets the name of the argument that caused the error.
	 * 
	 * @returns {string|null}
	 */
	get argumentName() {
		return this.#_argumentName;
	}
}

/**
 * Throws an {@link ArgumentError} if the given value is `null`.
 *
 * @param {*} value - The value to check.
 * @param {string} [argumentName] - The name of the argument being checked.
 * @throws {ArgumentError}
 */
export function throwIfNull(value, argumentName) {
	if(value === null)
		throw new ArgumentError(`${(argumentName ?? "argument")} can not be 'null'`, argumentName)
}

/**
 * Throws an {@link ArgumentError} if the given value is `undefined`.
 *
 * @param {*} value - The value to check.
 * @param {string} [argumentName] - The name of the argument being checked.
 * @throws {ArgumentError}
 */
export function throwIfUndefined(value, argumentName) {
	if(value === undefined)
		throw new ArgumentError(`${(argumentName ?? "argument")} can not be 'undefined'`, argumentName)
}

/**
 * Throws an {@link ArgumentError} if the given value is `null` or `undefined`.
 *
 * @param {*} value - The value to check.
 * @param {string} [argumentName] - The name of the argument being checked.
 * @throws {ArgumentError}
 */
export function throwIfNullOrUndefined(value, argumentName) {
	if(value == null)
		throw new ArgumentError(`${(argumentName ?? "argument")} can not be 'null' or 'undefined'`, argumentName)
}

/**
 * Always throws an {@link ArgumentError} indicating a required argument is missing.
 *
 * @param {string} [argumentName] - The name of the missing argument.
 * @throws {ArgumentError}
 */
export function throwMissingArgument(argumentName) {
	throw new ArgumentError(`${(argumentName ?? "argument")} is missing`, argumentName)
}

/**
 * Throws an {@link ArgumentError} if the given value is an empty string.
 *
 * @param {*} value - The value to check.
 * @param {string} [argumentName] - The name of the argument being checked.
 * @throws {ArgumentError}
 */
export function throwIfEmptyString(value, argumentName) {
	if (value === "") 
		throw new ArgumentError(`${argumentName ?? "argument"} cannot be an empty string`, argumentName);
}

/**
 * Throws an {@link ArgumentError} if the given value is `null`, `undefined`,
 * or a string that is empty or only whitespace.
 *
 * @param {*} value - The value to check.
 * @param {string} [argumentName] - The name of the argument being checked.
 * @throws {ArgumentError}
 */
export function throwIfNullOrWhitespace(value, argumentName) {
	/* actually null, undefined or empty string (if it is a string) */
	if (value == null || (isString(value) && value.trim() === ""))
		throw new ArgumentError(`${argumentName ?? "argument"} cannot be null, empty, or whitespace`, argumentName);
}