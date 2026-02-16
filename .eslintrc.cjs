module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: ["standard", "prettier"],
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
	},
	globals: {
		testRule: "readonly",
	},
	rules: {},
};
