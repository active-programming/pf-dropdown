'use strict';

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function(env) {
    let mode = env && env.mode ? env.mode : 'plugin';

    if (mode === 'testpage') {
        return {
            context: __dirname,
            entry: [
                './src/js/test-page.js'
            ],
            output: {
                filename: './demo/test-page.js'
            },
            module: {
                loaders: [
                    {
                        test: /\.(js|jsx)$/,
                        loader: "babel-loader",
                        query: {
                            presets: ["env"]
                        }
                    }
                ]
            },
            plugins: [
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery'
                }),
                new webpack.optimize.UglifyJsPlugin()
            ]
        };
    }
    // plugin
    return  {
        context: __dirname,
        entry: [
            './src/js/pf-dropdown.js',
            './src/scss/default.scss'
        ],
        output: {
            path: path.resolve(__dirname, 'distr'),
            filename: './js/pf-dropdown.js'
        },
        module: {
            loaders: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: "babel-loader",
                    query: {
                        presets: ["env"]
                    }
                },
                {
                    test: /\.css$/,
                    loader: ExtractTextPlugin.extract({
                        use: 'css-loader?importLoaders=1',
                    }),
                },
                {
                    test: /\.(sass|scss)$/,
                    use: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
                }
            ]
        },
        plugins: [
            new webpack.ProvidePlugin({}),
            new webpack.optimize.UglifyJsPlugin(),
            new ExtractTextPlugin({
                filename: './css/default.css',
                allChunks: true
            }),
        ]
    };

};