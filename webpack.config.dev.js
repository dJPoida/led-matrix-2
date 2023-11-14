/* eslint-disable @typescript-eslint/no-var-requires */
const wpMerge = require('webpack-merge');

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const dotenv = require('dotenv');
const packageJson = require('./package.json');
const baseConfig = require('./webpack.config.base.js');

const clientSourcePath = path.resolve(__dirname, 'src/client');
const clientDistPath = path.resolve(__dirname, 'dist/client');
const tsConfigPath = path.resolve(__dirname, 'tsconfig.client.dev.json');

const appTitle = 'LED Matrix';
const appVersionSuffix = packageJson.version.replace(/\./g, '-');

dotenv.config();

module.exports = wpMerge.merge(baseConfig, {
  mode: 'development',
  // devtool: 'inline-source-map',
  entry: {
    index: [
      // Dev server client for web socket transport, hot and live reload logic
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=1000&reload=true',
      // Index
      './src/client/index.tsx',
    ],
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
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      // {
      //   enforce: 'pre',
      //   test: /\.js$/,
      //   loader: 'source-map-loader',
      // },
      {
        test: /\.(scss|css)$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // sourceMap: true,
              url: false,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              // sourceMap: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Plugin for hot module replacement
    new webpack.HotModuleReplacementPlugin(),

    // Provide some global variables to the client
    new webpack.DefinePlugin({
      // Put: 'client side variables here'
      __ENVIRONMENT__: JSON.stringify('development'),
      __LOG_LEVEL__: JSON.stringify(process.env.LOG_LEVEL),
    }),

    // Use HTML Webpack Plugin to copy and populate our html templates
    new HtmlWebpackPlugin({
      title: appTitle,
      template: path.resolve(clientSourcePath, 'index.html'),
      filename: path.resolve(clientDistPath, 'index.html'),
      hash: true,
      chunks: ['index'],
      templateParameters: {
        appTitle: appTitle,
        appVersionSuffix,
        jsSuffix: 'development',
      },
    }),
  ],
});
