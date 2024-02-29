const path = require('path');
const HtmlBundlerPlugin = require('html-bundler-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


module.exports = (env, argv) => {
    const ISDEV = (argv.mode === "development");
    return {
        // entry: {
        //     'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
        // 	'json.worker': 'monaco-editor/esm/vs/language/json/json.worker',
        // 	'css.worker': 'monaco-editor/esm/vs/language/css/css.worker',
        // 	'html.worker': 'monaco-editor/esm/vs/language/html/html.worker',
        // 	'ts.worker': 'monaco-editor/esm/vs/language/typescript/ts.worker',
        // },
        devtool: ISDEV ? 'eval' : false,
        output: {
            clean: true,
            path: path.resolve(__dirname, 'dist'),
            filename: `static/bundle/[name].bundle[ext][query]`,
            assetModuleFilename: `static/assets/${ISDEV ? "[name]-dev." : ""}[contenthash:16][ext][query]`,
            // asyncChunks: true,
            charset: true,
            chunkFilename: `static/chunk/[id].js`,
            compareBeforeEmit: ISDEV,
            crossOriginLoading: "anonymous",
            devtoolFallbackModuleFilenameTemplate: "webpack:///[resource-path]",
            devtoolModuleFilenameTemplate: "webpack:///[resource-path]?[loaders]",
            devtoolNamespace: "webpack",
            hotUpdateChunkFilename: '[id].[fullhash].hot-update.js',
            ignoreBrowserWarnings: !ISDEV,
            sourceMapFilename: "[file].map",
        },
        module: {
            rules: [
                {
                    test: /\.(s?c|sa)ss$/,
                    use: ['css-loader', 'sass-loader'],
                    generator: {
                        filename: `static/styles/${ISDEV ? "[name]-dev." : ""}[contenthash:16][ext][query]`,
                    },
                },
                {
                    test: /(\.(ico|png|jpe?g|webp|svg|gif)|site.webmanifest|browserconfig.xml)$/,
                    type: 'asset/resource',
                    generator: {
                        filename: `static/assets/${ISDEV ? "[name]-dev." : ""}[contenthash:16][ext][query]`,
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
                    filename: `static/scripts/${ISDEV ? "[name]-dev." : ""}[contenthash:16].js`,
                },
                css: {
                    filename: `static/styles/${ISDEV ? "[name]-dev." : ""}[contenthash:16].css`,
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
                    { from: "src/_headers" },
                    { from: "src/_redirects" },
                ],
            }),
            new MonacoWebpackPlugin({
                languages: ['python', 'json'],
                globalAPI: true,
            }),
        ],
        // optimization: {
        //     splitChunks: {
        //         chunks: 'all',
        //         minSize: 0,
        //         maxInitialRequests: Infinity,
        //         cacheGroups: {
        //             vendor: {
        //                 test: /[\\/]node_modules[\\/]/,
        //                 name: 'vendor',
        //                 chunks: 'all',
        //             },
        //         },
        //     },
        //     removeEmptyChunks: true,
        //     mergeDuplicateChunks: true,
        // },
        stats: {
            errorDetails: ISDEV,
        },
    };
};
