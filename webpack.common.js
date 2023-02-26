const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');  

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    optimization: {
        usedExports: true
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        transpileOnly: true,
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/i,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            }
            ,
            {
                test: /\.(glsl|vs|fs)$/,
                loader: 'ts-shader-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
            chunkFilename: '[id].css'
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new ForkTsCheckerWebpackPlugin(),
        new CopyPlugin({
            patterns: [{ from: 'src/assets', to: 'assets' }]
        }),
        new ESLintPlugin({
            extensions: ['.tsx', '.ts', '.js'],
            exclude: 'node_modules'
        })
    ]
};