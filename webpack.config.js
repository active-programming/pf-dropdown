'use strict';

const path = require('path');
const webpack = require('webpack');

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
            './src/js/pf-dropdown.js'
        ],
        output: {
            path: path.resolve(__dirname, 'distr'),
            filename: './js/pf-dropdown.js'
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
            new webpack.ProvidePlugin({}),
            new webpack.optimize.UglifyJsPlugin()
        ]
    };

};