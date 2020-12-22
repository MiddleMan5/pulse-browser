module.exports = {
    extends: "@loopback/eslint-config",
    rules: {
        "no-console": "off",
        "global-require": "off",
        "import/no-dynamic-require": "off"
        "@typescript-eslint/naming-convention": "warn",
        "@typescript-eslint/no-unused-vars": "warn",
        "@typescript-eslint/no-unused-vars/no-explicit-any": "warn",
        "no-constant-condition": "warn",
    },
};
