const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const pkg = require('./package.json');
const isProduction = process.env.NODE_ENV === 'production';

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/client/index.js',
  output: {
    publicPath: '/',
    filename: `js/[name].js${isProduction ? '?[chunkhash]' : ''}`,
    devtoolFallbackModuleFilenameTemplate: `webpack:///${pkg.name}/[resource-path]?[hash]`,
    devtoolModuleFilenameTemplate: `webpack:///${pkg.name}/[resource-path]`,
    path: path.join(__dirname, 'public'),
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/,
        options: {
          configFile: './babel.config.js',
        },
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'img'
            },
          },
        ],
      },
    ],
  },
  profile: true,
  stats: {
    children: false,
    colors: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      template: 'src/client/index.html',
      publicPath: '/',
      inject: 'body',
      minify: isProduction ? {
        minifyJS: true,
        collapseWhitespace: true
      } : false,
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/client/sw.js')
    }),
    new Dotenv(),
  ],
};

if (!isProduction) {
  config.devtool = 'cheap-module-eval-source-map';
  config.devServer = {
    compress: true,
    inline: true,
    hot: true,
    disableHostCheck: true,
    publicPath: '/',
    stats: 'errors-only',
    historyApiFallback: true,
    proxy: {
      '/api/*': 'http://localhost:3000',
    },
  };
}

module.exports = config;
