module.exports = {
    env: {
        node: true,
        es2020: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'prettier',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ['./tsconfig.json'],
    },
    plugins: ['@typescript-eslint'],
    root: true,
    rules: {
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/restrict-template-expressions': 'off',
        '@typescript-eslint/no-misused-promises': [
            'error',
            {
                checksVoidReturn: {
                    arguments: false,
                },
            },
        ],
        '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
        'react-hooks/exhaustive-deps': [
            'warn',
            {
                additionalHooks: '\\b(useAsyncEffects)\\b',
            },
        ],
    },
};
