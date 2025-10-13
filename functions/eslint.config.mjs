export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module", 
    },
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off", 
      "eqeqeq": "error", 
      "curly": "error", 
    },
  },
  {
    files: ["**/*.ts"], 
    languageOptions: {
      parser: "@typescript-eslint/parser",
    },
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
];