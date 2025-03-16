import next from "@next/eslint-plugin-next";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import { fileURLToPath } from "url";
import path from "path";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      "@typescript-eslint": typescriptEslint,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: path.join(__dirname, "./tsconfig.json"),
      },
    },
    rules: {
      // Ignore unused variables prefixed with _ and ignore type/interface declarations completely
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "argsIgnorePattern": "^_",
          "varsIgnorePattern": "^_",
          "ignoreRestSiblings": true,
          "vars": "all",
          "args": "after-used"
        }
      ],
      "@typescript-eslint/no-explicit-any": ["warn", { "ignoreRestArgs": true }],
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
];
