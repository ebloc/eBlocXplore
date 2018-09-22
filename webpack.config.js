const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

require('dotenv').config(); // collect environment variables from .env file

const commonConfig = {
  entry: ['babel-polyfill', './src/client/index.js'],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss)$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        loader: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    alias: {
      Utils: path.resolve(__dirname, 'src/client/utils'),
      Components: path.resolve(__dirname, 'src/client/components'),
      Actions: path.resolve(__dirname, 'src/client/state/actions')
    }
  },
  plugins: [
    new CleanWebpackPlugin('dist'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        API_ENDPOINT: JSON.stringify(process.env.API_ENDPOINT || 'http://localhost'),
        PORT: JSON.stringify(process.env.PORT || '8000')
      }
    }),
    new HtmlWebpackPlugin({
      title: 'eBlocXplore',
      meta: {
        viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no'
      }
    }),
    new FaviconsWebpackPlugin(path.resolve(__dirname, 'src/client/assets/favicon.ico')),
    new webpack.HotModuleReplacementPlugin()
  ]
};

const envConfig = {
  development: {
    mode: 'development',
    devServer: {
      contentBase: [path.resolve(__dirname, 'dist')],
      publicPath: 'http://localhost:8080/', // for HMR
      hotOnly: true,
      historyApiFallback: true
    },
    devtool: 'cheap-module-source-map'
  },
  production: {
    mode: 'production',
    devtool: 'sourcemap',
    optimization: {
      minimizer: [new UglifyJsPlugin({
        sourceMap: true
      })]
    }
  }
};

module.exports = webpackMerge(
  commonConfig,
  envConfig[process.env.NODE_ENV || 'development']
)