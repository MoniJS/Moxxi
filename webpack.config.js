let path = require("path");
let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  mode: "development",
  entry: "./vue/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "dist.bundle.js"
  },
  module: {
    rules: [
      {
        "test": /\.css$/,
        "use": [
          "css-loader",
          {
            loader: "sass-loader",
            options: {
              implementation: require("dart-sass")
            }
          }
        ]
      },
      {
        "test": /\.vue$/,
        "use": ["vue-loader"]
      },
      {
        "test": /\.js$/,
        "use": ["babel-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new VueLoaderPlugin()
  ],
  devServer: {
    hot: true,
    compress: false,
    port: 8080,
    proxy: {
      "/public": "http://localhost:3000"
    }
  }

};