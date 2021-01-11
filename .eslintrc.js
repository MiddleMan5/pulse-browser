module.exports = {
    extends: "@loopback/eslint-config",
    rules: {
        "no-console": "off",
        "global-require": "off",
        "import/no-dynamic-require": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",
        "no-constant-condition": "warn",
    },
};
