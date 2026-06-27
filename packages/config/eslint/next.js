/** @type {import("eslint").Linter.Config} */
const { resolve } = require("node:path");
const base = require("./base");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  ...base,
  extends: [
    ...(base.extends ?? []),
    "next/core-web-vitals",
    "next/typescript",
  ],
  rules: {
    ...base.rules,
    "@next/next/no-html-link-for-pages": "off",
  },
};
