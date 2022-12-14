const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  mode: "development",
  entry: {
    main: "./src/client/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
    extensionAlias: {
      ".ts": [".js", ".ts"],
      ".cts": [".cjs", ".cts"],
      ".mts": [".mjs", ".mts"],
    },
  },
  module: {
    rules: [
      {
        test: /.([cm]?ts|tsx)$/,
        loader: "ts-loader",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/static/index.html",
      filename: "app.html",
    }),
  ],
  // devServer is for client only development
  devServer: {
    static: {
      directory: path.resolve(__dirname, "public"),
    },
    compress: true,
    port: 9000,
  },
}
