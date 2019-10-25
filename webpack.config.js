// const webpack = require("webpack");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  // target: "electron-main",
  target: "electron-renderer",
  // target: "web",
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist"
  },
  // browser: {
  //   fs: false
  // },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  plugins: [],

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
      // {
      //   test: /\.wasm$/,
      //   loader: "wasm-loader",
      //   type: "javascript/auto"
      // }
      // {
      //   test: /\.wasm$/,
      //   loaders: ["wasm-loader"]
      // }
      // {
      //   test: /\.wasm$/,
      //   type: "webassembly/experimental"
      // }
      // {
      //   // test: /xgboost.wasm$/,
      //   test: /\.wasm$/,
      //   type: "javascript/auto" // ← !!
      //   // type: "webassembly/experimental"
      //   // loader: "file-loader"
      //   // options: {
      //   //   publicPath: "dist/"
      //   // }
      // }
      // {
      //   test: /\.css$/,
      //   use: [
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {
      //         // you can specify a publicPath here
      //         // by default it use publicPath in webpackOptions.output
      //         publicPath: "../"
      //       }
      //     },
      //     "css-loader"
      //   ]
      // }
    ]
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  externals: {
    bindings: `require("bindings")`, // fixes warnings during build
    react: "React",
    "react-dom": "ReactDOM"
    // "better-sqlite3": `require("better-sqlite3")` not sure why this was here, looks like can live without
    // "ml-xgboost": `require("ml-xgboost")`
    // libsvm: `require("libsvm")`
  }

  // plugins: [new webpack.ContextReplacementPlugin(/bindings$/, /^$/)]
};
