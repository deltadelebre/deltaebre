// ESLint 9 (flat config) — enfocat a correcció i accessibilitat.
// Instal·la les dependències amb:  npm install
// Executa amb:                     npm run lint
import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  // No analitzem build, dependències, el CMS ni els fitxers de configuració de l'arrel.
  { ignores: ["dist/**", "node_modules/**", "public/**", "*.config.js", "eslint.config.js"] },

  {
    files: ["src/**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat["jsx-runtime"].rules, // React 17+ : no cal importar React a cada fitxer
      ...jsxA11y.flatConfigs.recommended.rules,

      // Els dos que de debò cacen errors d'execució:
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // Ajustos per a aquest projecte (menys soroll, sense afluixar accessibilitat):
      "react/prop-types": "off",            // no fem servir PropTypes
      "react/no-unescaped-entities": "off", // text multilingüe amb apòstrofs
      "no-unused-vars": ["warn", { caughtErrors: "none", argsIgnorePattern: "^_", varsIgnorePattern: "^_" }],
    },
  },
];
