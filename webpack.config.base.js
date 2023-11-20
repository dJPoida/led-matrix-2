/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const dotenv = require('dotenv');
const packageJson = require('./package.json');

const clientSourcePath = path.resolve(__dirname, 'src/client');
const clientDistPath = path.resolve(__dirname, 'dist/client');

dotenv.config();

module.exports = {
  output: {
    filename: 'js/[name].bundle.js',
    path: clientDistPath,
    clean: true,
    publicPath: '/',
  },

  performance: {
    // Set the max asset size to 2mb
    maxAssetSize: 2000000,
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css', '.scss'],
  },

  plugins: [
    // Provide some global variables to the client
    new webpack.DefinePlugin({
      // Put: 'client side variables here'
      __VERSION__: JSON.stringify(packageJson.version),
      // TODO: Implement proper auth in the Webpack Config
      __CLIENT_KEY__: JSON.stringify(process.env.CLIENT_KEY),
    }),

    // Copy other static assets to our dist folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join(clientSourcePath, 'public'),
          to: path.resolve(clientDistPath),
          toType: 'dir',
        },
      ],
    }),
  ],

  // Try and re-use some vendor packages so the client doesn't have to re-download huge amounts of data when they don't change
  optimization: {
    splitChunks: {
      cacheGroups: {
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'vendor-react',
          chunks: 'all',
        },
      },
    },
  },
};
