import stylelint from "stylelint";
import Color from "colorjs.io";

import {
	isInColorGamutP3MediaQuery,
	isStandardSyntaxProperty,
	declarationValueIndex,
	isInColorGamutRec2020MediaQuery,
	startsWithNumber,
} from "./utils.js";

const ruleName = "gamut/color-no-out-gamut-range";

const messages = stylelint.utils.ruleMessages(ruleName, {
	rejected: (color) => `Unexpected color out of gamut range "${color}"`,
});

const meta = {
	url: "https://github.com/fpetrakov/stylelint-gamut/blob/master/src/README.md",
};

const getFunctionCalls = (value) => {
	const matches = [];
	const pattern = /(oklch|oklab|lab|lch|var)\s*\(/gi;

	for (let match; (match = pattern.exec(value)); ) {
		const start = match.index;
		const openIndex = start + match[0].length - 1;
		let depth = 0;
		let end = -1;

		for (let i = openIndex; i < value.length; i++) {
			if (value[i] === "(") {
				depth += 1;
			} else if (value[i] === ")") {
				depth -= 1;
				if (depth === 0) {
					end = i + 1;
					break;
				}
			}
		}

		if (end !== -1) {
			matches.push(value.slice(start, end));
			pattern.lastIndex = end;
		}
	}

	return matches;
};

const splitAtTopLevelComma = (value) => {
	let depth = 0;

	for (let i = 0; i < value.length; i++) {
		const char = value[i];

		if (char === "(") {
			depth += 1;
		} else if (char === ")") {
			depth -= 1;
		} else if (char === "," && depth === 0) {
			return [value.slice(0, i), value.slice(i + 1)];
		}
	}

	return [value, ""];
};

const startsWithVarFunction = (value) => /^var\s*\(\s*--/.test(value);

const resolveCustomPropertyValue = (
	value,
	customProperties,
	seen = new Set(),
) => {
	if (!startsWithVarFunction(value)) {
		return value;
	}

	const inner = value.slice(value.indexOf("(") + 1, -1).trim();
	const [name, fallback = ""] = splitAtTopLevelComma(inner);
	const varName = name.trim();

	if (seen.has(varName)) {
		return "";
	}

	seen.add(varName);

	if (customProperties[varName] && !customProperties[varName].inQuery) {
		return resolveCustomPropertyValue(
			customProperties[varName].value,
			customProperties,
			seen,
		);
	}

	if (fallback.trim()) {
		return resolveCustomPropertyValue(
			fallback.trim(),
			customProperties,
			seen,
		);
	}

	return "";
};

/** @type {import('stylelint').Rule} */
const ruleFunction = (primary) => {
	return (root, result) => {
		const validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: primary,
		});

		if (!validOptions) {
			return;
		}

		const customProperties = {};

		root.walkDecls((decl) => {
			if (!isStandardSyntaxProperty(decl.prop)) return;

			const values = getFunctionCalls(decl.value);

			if (!values.length) return;

			// value is e.g. lch(48% 82 283 / 67%)
			for (const value of values) {
				check(value);
			}

			function check(value) {
				const shouldBeIgnored =
					!startsWithVarFunction(value) &&
					(/var\s*\(\s*--/.test(value) ||
						!startsWithNumber(value.split("(")[1]));

				if (shouldBeIgnored) return;

				const resolvedValue = resolveCustomPropertyValue(
					value,
					customProperties,
				);
				if (!resolvedValue) return;

				let color;

				try {
					color = new Color(resolvedValue);
				} catch {
					return;
				}

				if (color.inGamut("srgb")) return;
				if (color.inGamut("p3") && isInColorGamutP3MediaQuery(decl))
					return;
				if (
					color.inGamut("rec2020") &&
					isInColorGamutRec2020MediaQuery(decl)
				)
					return;

				if (decl.prop && decl.prop.startsWith("--")) {
					customProperties[decl.prop] = {
						value: decl.value.trim(),
						inQuery: false,
					};
					return;
				}

				const index = declarationValueIndex(decl);
				const endIndex = index + decl.value.length;
				stylelint.utils.report({
					message: messages.rejected(value),
					node: decl,
					index,
					endIndex,
					result,
					ruleName,
				});
			}
		});
	};
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;
ruleFunction.meta = meta;

const plugin = stylelint.createPlugin(ruleName, ruleFunction);

export default plugin;
export { ruleName, messages, meta };
