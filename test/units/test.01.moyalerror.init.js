/*!
 * File: test/units/test.01.moyalerror.init.js
 */

import { TestGroup } from "@moyal/js-test";
import { MoyalError, printCauseChain } from "../../src/index.js";
import BuildInfo from "../../src/auto-generated/build-info.js";

export default new TestGroup("MoyalError initialization and behavior")
	.areEqual("Validate the version", BuildInfo.version, MoyalError.version)
	.noThrows("Create MoyalError with message only", () => new MoyalError("Something went wrong"))

	.noThrows("Create MoyalError with message and Error as cause", () =>
		new MoyalError("Something went wrong", new Error("Inner cause"))
	)

	.noThrows("Create MoyalError with message and object with cause", () =>
		new MoyalError("Something went wrong", { cause: new Error("Inner cause") })
	)

	.throws(
		"Accessing cause should return expected inner error",
		() => {
			const inner = new Error("Inner failure");
			const outer = new MoyalError("Outer failure", { cause: inner });
			if (outer.cause !== inner) throw new Error("Cause mismatch");
			throw new Error("Intentional test exception"); // Ensure throws is triggered
		},
		(err) => err.message === "Intentional test exception"
	)

	.noThrows("Calling toString() should succeed", () => {
		const err = new MoyalError("Test error", new Error("Inner"));
		const s = err.toString();
		if (typeof s !== "string" || !s.includes("Test error")) {
			throw new Error("Invalid toString output");
		}
	})

	.noThrows("Calling fullStack should include all nested stack traces", () => {
		const err = new MoyalError("Top", {
			cause: new MoyalError("Mid", {
				cause: new Error("Root")
			})
		});
		const stack = err.fullStack;
		if (!stack.includes("Top") || !stack.includes("Mid") || !stack.includes("Root")) {
			throw new Error("Missing stack content");
		}
	})

	.noThrows("toJSON() returns valid structured object", () => {
		const err = new MoyalError("Outer", {
			cause: new MoyalError("Inner")
		});
		const json = err.toJSON();
		if (
			!json ||
			typeof json !== "object" ||
			json.name != "MoyalError" ||
			json.message != "Outer" ||
			!json.timestamp ||
			!json.cause
		) {
			throw new Error("Invalid JSON output");
		}

		if (
			typeof json.cause !== "object" ||
			json.cause.name != "MoyalError" ||
			json.cause.message != "Inner" ||
			!json.cause.timestamp ||
			json.cause.cause
		) {
			throw new Error("Invalid JSON cuase output");
		}
	})

	.noThrows("printCauseChain() returns all messages", () => {
		const err = new MoyalError("Outer", {
			cause: new MoyalError("Inner", {
				cause: new Error("Root")
			})
		});
		const chain = printCauseChain(err);
		if (
			typeof chain !== "string" ||
			!chain.includes("Outer") ||
			!chain.includes("Inner") ||
			!chain.includes("Root")
		) {
			throw new Error("Cause chain is incomplete");
		}
	});
