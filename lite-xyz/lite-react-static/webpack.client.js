const HtmlWebpackPlugin = require("html-webpack-plugin")
const path = require("path")

const moduleFileExtensions = [
  "web.mjs",
  "mjs",
  "web.js",
  "js",
  "web.ts",
  "ts",
  "web.tsx",
  "tsx",
  "json",
  "web.jsx",
  "jsx",
]

const staticPages = ["about", "contact", "home"]
const staticPagesEntries = staticPages.reduce((acc, page) => {
  acc[page] = {
    import: path.resolve(
      __dirname,
      path.resolve(`client/pages/${page}/page.tsx`)
    ),
  }
  return acc
}, {})
const staticPagesHtmlWebpackPlugins = staticPages.map(
  (page) =>
    new HtmlWebpackPlugin({
      filename: `client/html/${page}.html`,
      chunks: [page],
      template: path.resolve(__dirname, "client/template.html"),
    })
)

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    ...staticPagesEntries,
  },
  output: {
    clean: true, // Clean the output directory before emit.
    filename: "client/js/[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  optimization: {
    minimize: false,
    splitChunks: {
      minSize: 0,
      chunks: "all",
    },
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
  plugins: [...staticPagesHtmlWebpackPlugins],
}
