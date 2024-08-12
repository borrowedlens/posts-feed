import eslintPluginSvelte from "eslint-plugin-svelte";
export default [
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  ...eslintPluginSvelte.configs["flat/recommended"],
];
