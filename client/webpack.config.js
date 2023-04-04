/* eslint-disable */
const path = require('path');

module.exports = {
    mode: 'production',
    context: __dirname,
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },
    rules: [
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            resolve: {
                extensions: ['.js', '.jsx'],
            },
            use: [
                {
                    loader: 'babel-loader',
                },
                'url-loader',
            ],
        },
        {
            loader: 'react-svg-loader',
            options: {
                jsx: true, // true outputs JSX tags
            },
        },
    ],
};
