const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    ],
  },
  devtool: 'cheap-module-eval-source-map',
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
  ],
};

if (!isProduction) {
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
