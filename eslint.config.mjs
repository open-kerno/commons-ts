import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierPlugin from "eslint-plugin-prettier";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";

export default [
	{
		ignores: ["lib/**", "dist/**"],
	},
	{
		files: ["**/*.ts"],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: "latest",
				sourceType: "module",
			},
			globals: {
				...globals.node,
				...globals.jest,
			},
		},
		plugins: {
			"@typescript-eslint": tsPlugin,
			prettier: prettierPlugin,
			"simple-import-sort": simpleImportSortPlugin,
		},
		rules: {
			"@typescript-eslint/interface-name-prefix": "off",
			"@typescript-eslint/explicit-function-return-type": "off",
			"@typescript-eslint/explicit-module-boundary-types": "off",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-unused-vars": ["error"],
			"prettier/prettier": ["error", { printWidth: 120 }],
			"simple-import-sort/exports": "error",
			"simple-import-sort/imports": "error",
		},
	},
];

