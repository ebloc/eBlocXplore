const path = require('path');
const webpack = require('webpack');

module.exports = {
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
  devServer: {
    contentBase: [path.resolve(__dirname, 'dist'), path.resolve(__dirname, 'src/client/public')],
    publicPath: 'http://localhost:8080/', // for HMR
    hotOnly: true,
    historyApiFallback: {
      index: 'index.html',
    },
  },
  devtool: 'cheap-module-source-map',
  plugins: [new webpack.HotModuleReplacementPlugin()],
  mode: 'development',
};
