/* eslint-disable */
module.exports = {
    root: true, // Make sure eslint picks up the config at the root of the directory
    env: {
        browser: true, // Enables browser globals like window and document
        amd: true, // Enables require() and define() as global variables as per the amd spec.
        node: true, // Enables Node.js global variables and Node.js scoping.
        es6: true,
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        parser: 'babel-eslint',
        ecmaVersion: 2021, // Use the latest ecmascript standard
        ecmaFeatures: {
            jsx: true, // Enable JSX since we're using React
        },
        sourceType: 'module', // Allows using import/export statements
        allowImportExportEverywhere: true,
    },
    settings: {
        react: {
            version: 'detect', // Automatically detect the react version
        },
    },
    extends: [
        'eslint:recommended',
        // 'prettier',
        'plugin:react/recommended',
        // 'plugin:prettier/recommended',
        'plugin:react-hooks/recommended',
    ],
    plugins: [],
    rules: {
        // 'prettier/prettier': ['error', {}, { usePrettierrc: true }], // Use our .prettierrc file as source
        eqeqeq: 'off',
        'max-len': [
            'error',
            {
                code: 120,
                tabWidth: 2,
                comments: 120,
                ignoreComments: true,
                ignoreTrailingComments: true,
                ignoreUrls: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true,
            },
        ],
        'linebreak-style': 0,
        'object-shorthand': ['error', 'always'],
        'newline-before-return': 'error',
        // 'newline-after-var': 'error',
        'arrow-parens': ['error', 'always'],
        'arrow-body-style': [2, 'as-needed'],
        'comma-dangle': [2, 'always-multiline'],

        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'off',

        'react/display-name': ['off', { ignoreTranspilerName: false }],
        'react/forbid-prop-types': [
            'error',
            {
                forbid: ['any', 'array', 'object'],
                checkContextTypes: true,
                checkChildContextTypes: true,
            },
        ],
        'react/forbid-dom-props': ['off', { forbid: [] }],
        'react/no-multi-comp': ['error', { ignoreStateless: true }],
        'react/destructuring-assignment': ['off', 'never'],
        'react/no-unescaped-entities': 'off',
        'react/no-array-index-key': 'off',
        'react/prop-types': 'off',

        'react/jsx-props-no-spreading': 'off',
        'react/jsx-uses-vars': 'error',
        'react/jsx-handler-names': [
            'off',
            {
                eventHandlerPrefix: 'handle',
                eventHandlerPropPrefix: 'on',
            },
        ],
        'react/jsx-key': 'error',
        'react/jsx-no-bind': [
            'error',
            {
                ignoreRefs: true,
                allowArrowFunctions: true,
                allowFunctions: false,
                allowBind: false,
                ignoreDOMComponents: true,
            },
        ],
        'react/jsx-pascal-case': 'error',
        'react/jsx-filename-extension': [1, { extensions: ['.tsx', '.jsx'] }],
        'react/jsx-no-undef': ['error', { allowGlobals: true }],
        'react/react-in-jsx-scope': 'error',
        'react/jsx-no-duplicate-props': 'off',

        'no-eq-null': 'off',
        'no-multi-spaces': 'error',
        'no-nested-ternary': 'off',
        'no-underscore-dangle': 'off',
        'no-async-promise-executor': 'warn',
        'no-prototype-builtins': 'off',
        'no-plusplus': 'off',
        'no-return-assign': 'off',
        'no-var': 'error',
        'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
        'no-console': [
            'warn',
            {
                allow: ['warn', 'error'],
            },
        ],
        //! Only for development
        // 'no-console': 'off',
        'no-restricted-syntax': [
            'error',
            {
                selector: "CallExpression[callee.object.name='console'][callee.property.name!=/^(log|warn|error|info|trace)$/]",
                message: 'Unexpected property on console object was called',
            },
        ],
        'no-unused-vars': 'warn',
    },
};
