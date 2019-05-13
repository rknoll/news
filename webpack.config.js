const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const webpack = require('webpack');
const pkg = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

process.env.IS_WEBPACK = 'true';

const config = {
  mode: isProduction ? 'production' : 'development',
  entry: path.join(__dirname, 'src/client/index.js'),
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
          configFile: path.join(__dirname, 'babel.config.js'),
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
        test: /\.(png)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets'
          }
        }]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts'
          }
        }]
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
      filename: 'index.html',
      template: path.join(__dirname, 'src/client/index.html'),
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
    new Dotenv({
      safe: true,
      systemvars: true,
      silent: true,
    }),
    new WebappWebpackPlugin({
      logo: path.join(__dirname, 'src/client/assets/icon-red.png'),
      favicons: {
        appName: 'News',
        appleStatusBarStyle: 'black',
        theme_color: '#b71c1c',
        background: '#ffffff',
        start_url: '/',
      },
    }),
    new webpack.DefinePlugin({
      ASSETS_VERSION: webpack.DefinePlugin.runtimeValue(() => `'${new Date().valueOf()}'`),
    }),
  ],
};

if (!isProduction) {
  config.devtool = 'cheap-module-eval-source-map';
  config.resolve = { alias: { 'react-dom': '@hot-loader/react-dom' } };
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
      '/img/*': 'http://localhost:3000',
    },
  };
}

module.exports = config;
