const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
  entry: {
    main: path.resolve(__dirname,'./js/main.js')
  },
  mode: 'development',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname,'./dist')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,'./aa.html'),
      publicPath: '/'
    })
  ],
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader'
    }]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    server: 'https',
    compress: true,
    port: 9000,
    hot: true
  }
}