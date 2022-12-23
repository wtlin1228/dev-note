const path = require("path")
const moduleFileExtensions = require("./webpack/module-file-extensions")

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.resolve(__dirname, "server/index.ts"),
  output: {
    clean: true, // Clean the output directory before emit.
    filename: "index.js",
    path: path.resolve(__dirname, "dist/server"),
  },
  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: require.resolve("babel-loader"),
      },
    ],
  },
  resolve: {
    extensions: moduleFileExtensions.map((ext) => `.${ext}`),
  },
}
