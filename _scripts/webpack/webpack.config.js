const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SizePlugin = require('size-plugin');

const projectRoot = path.join(__dirname, '../..');
const buildDirectory = path.join(projectRoot, 'frontend');
const distDirectory = path.join(projectRoot, 'public/dist');

const prod = process.env.NODE_ENV === "production";

const config = {
    entry: {
        main: [
            path.join(buildDirectory, 'main.js'),
            path.join(buildDirectory, 'scss/style.scss')
        ]
    },
    devtool: !prod ? 'inline-source-map' : '',
    output: {
        path: distDirectory,
        filename: '[name].[hash:6].js'
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
                options: {
                    failOnError: true,
                    failOnWarning: false
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            require.resolve('babel-preset-env'),
                            require.resolve('babel-preset-react')
                        ],
                        plugins: [
                            [require.resolve('babel-plugin-transform-react-jsx'), {pragma: 'h'}]
                        ]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {minimize: prod, url: false, sourceMap: !prod}},
                    {loader: 'sass-loader', options: {sourceMap: !prod}}
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[hash:6].css'
        }),
        new ManifestPlugin({
            fileName: 'rev-manifest.json'
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': !prod ? JSON.stringify("development") : JSON.stringify("production")
            }
        }),
        new SizePlugin()
    ]
};

if(prod) {
    config.plugins.push(
        new UglifyJsPlugin({
            uglifyOptions: {
                mangle: true,
                compress: {
                    negate_iife: false,
                    unsafe_comps: true,
                    properties: true,
                    keep_fargs: false,
                    pure_getters: true,
                    collapse_vars: true,
                    unsafe: true,
                    warnings: false,
                    sequences: true,
                    dead_code: true,
                    drop_debugger: true,
                    comparisons: true,
                    conditionals: true,
                    evaluate: true,
                    booleans: true,
                    loops: true,
                    unused: true,
                    hoist_funs: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true,
                    pure_funcs: ['classCallCheck', 'invariant', 'warning']
                }
            }
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                discardComments: {removeAll: true}
            }
        })
    );
}

module.exports = config;
