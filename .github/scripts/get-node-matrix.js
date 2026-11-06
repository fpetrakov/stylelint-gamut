import { appendFileSync, readFileSync } from "node:fs";

const stylelint = JSON.parse(
	readFileSync(`node_modules/stylelint/package.json`, `utf8`),
);

const range = stylelint.engines?.node;

if (!range) throw new Error(`Stylelint does not specify engines.node`);

const versions = range.split(`||`).map((part) => {
	const version = part.match(/(\d+)(?:\.(\d+))?(?:\.(\d+))?/u);

	if (!version) {
		throw new Error(`Cannot resolve minimum Node.js version: ${part}`);
	}

	return `${version[1]}.${version[2] ?? 0}.${version[3] ?? 0}`;
});

const output = JSON.stringify([...new Set(versions)]);

if (process.env.GITHUB_OUTPUT) {
	appendFileSync(process.env.GITHUB_OUTPUT, `node_versions=${output}\n`);
}

console.info(`Node.js matrix: ${output}`);
