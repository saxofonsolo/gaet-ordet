module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "./tsconfig.json",
    },
    env: {
        browser: false,
        commonjs: true,
        es6: true,
    },
    extends: [
        "@react-native-community",
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "prettier",
    ],
    plugins: ["@typescript-eslint", "import", "react", "unused-imports"],
    settings: {
        react: {
            version: "detect",
        },
    },
    overrides: [
        {
            files: "*.biblo.tsx",
            rules: {
                "import/no-default-export": 0,
            },
        },
    ],
    rules: {
        "@typescript-eslint/ban-ts-comment": ["off"],
        "@typescript-eslint/explicit-function-return-type": ["off"],
        "@typescript-eslint/explicit-module-boundary-types": ["error"],
        "@typescript-eslint/no-explicit-any": ["off"],
        "import/first": 1,
        "import/newline-after-import": 1,
        "import/no-default-export": 1,
        "import/no-mutable-exports": 1,
        "import/no-unused-modules": 1,
        "import/order": 1,
        "no-shadow": "off",
        "no-unused-vars": "off",
        "no-void": "off",
        "react-native/no-inline-styles": 0,
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": [
            "warn",
            {
                vars: "all",
                varsIgnorePattern: "^_",
                args: "after-used",
                argsIgnorePattern: "^_",
            },
        ],
    },
};
