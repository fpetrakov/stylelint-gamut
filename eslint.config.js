import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "eslint/config";
import globals from "globals";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig([
	{
		extends: compat.extends("standard", "prettier"),

		languageOptions: {
			globals: {
				...globals.nodeBuiltin,
			},

			ecmaVersion: "latest",
			sourceType: "module",
		},

		rules: {},
	},
]);
