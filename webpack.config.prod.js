/* eslint-disable @typescript-eslint/no-var-requires */
const wpMerge = require('webpack-merge');

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const packageJson = require('./package.json');
const baseConfig = require('./webpack.config.base.js');

const clientSourcePath = path.resolve(__dirname, 'src/client');
const clientDistPath = path.resolve(__dirname, 'dist/client');
const tsConfigPath = path.resolve(__dirname, 'tsconfig.client.prod.json');

const appTitle = 'LED Matrix';
const appVersionSuffix = packageJson.version.replace(/\./g, '-');

module.exports = wpMerge.merge(baseConfig, {
  mode: 'production',
  entry: {
    index: path.resolve(clientSourcePath, 'index.tsx'),
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          configFile: tsConfigPath,
        },
      },
      {
        test: /\.module\.(s?css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: false,
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
      // Loaders for module scss and css files
      {
        test: /\.(s?css)$/,
        exclude: /\.module.(s?css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Provide some global variables to the client
    new webpack.DefinePlugin({
      // Put: 'client side variables here'
      __ENVIRONMENT__: JSON.stringify('production'),
      __LOG_LEVEL__: JSON.stringify(process.env.LOG_LEVEL),
    }),

    // Use HTML Webpack Plugin to copy and populate our html templates
    new HtmlWebpackPlugin({
      title: appTitle,
      template: path.resolve(clientSourcePath, `index.html`),
      filename: path.resolve(clientDistPath, `index.html`),
      hash: true,
      chunks: ['index'],
      templateParameters: {
        appTitle: appTitle,
        appVersionSuffix,
        jsSuffix: 'production.min',
      },
    }),

    // Clean the dist directory before performing a production build
    new CleanWebpackPlugin(),

    // Extract the compiled CSS for each entry point into an external file
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
});
