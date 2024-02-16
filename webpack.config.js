const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");


module.exports = {
    mode: 'development',
    output: {
        clean: true,
        path: path.resolve(__dirname, 'dist'),
        filename: "if-you-see-this-something-went-wrong.[name].[contenthash:8][ext][query]"
    },
    module: {
        rules: [
            {
                test: /\.(css|sass|scss)$/,
                use: ['css-loader', 'sass-loader'],
                generator: {
                    filename: '_assets/[contenthash:16][ext][query]',
                },
            },
            {
                test: /(\.(ico|png|jpe?g|webp|svg|gif)|site.webmanifest|browserconfig.xml)$/,
                type: 'asset/resource',
                generator: {
                    filename: '_assets/[contenthash:16][ext][query]',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.scss', '.css'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
    plugins: [
        new HtmlBundlerPlugin({
            entry: 'src/pages',
            js: {
                filename: '_assets/[contenthash:16].js',
            },
            css: {
                filename: '_assets/[contenthash:16].css',
            },
            loaderOptions: {

                root: path.join(__dirname, 'src'),
                sources: [
                    {
                        tag: 'link',
                        filter: ({ tag, attribute, value, attributes, resourcePath }) => {
                            if (attribute !== 'href') return false;
                        },
                    },
                    {
                        tag: 'meta',
                        filter: ({ tag, attribute, value, attributes, resourcePath }) => {
                            console.log("!!!!!!", attributes)
                            if (attribute !== 'content') return false;
                            if (!("name" in attributes)) return false;
                            if (attributes["name"] !== "msapplication-config") return false;
                        },
                    },
                ],
            },
        }),
        new CopyWebpackPlugin({
            patterns: [
              { from: "node_modules", to: "node_modules" },
              { from: "src/_headers" },
              { from: "src/_redirects" },
            ],
          }),
    ],
    entry: {
        'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
        'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
        'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
        'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker'
    },
};