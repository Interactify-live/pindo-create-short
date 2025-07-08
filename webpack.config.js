const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ProvidePlugin } = require("webpack");

/** @type {import('webpack').Configuration[]} */
module.exports = [
  /* ---------- CommonJS build (main) ---------- */
  {
    name: "cjs",
    mode: "production",
    entry: path.resolve(__dirname, "src", "index.ts"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.cjs.js",
      library: {
        type: "umd",
        name: "InteractifyUi",
        export: "named",
      },
      globalObject: "this",
      clean: false, // Don't clean dist as TypeScript will generate declarations
      // Prevent chunk loading issues
      chunkLoading: false,
      wasmLoading: false,
    },
    externals: {
      react: {
        commonjs: "react",
        commonjs2: "react",
        amd: "react",
        root: "React",
      },
      "react-dom": {
        commonjs: "react-dom",
        commonjs2: "react-dom",
        amd: "react-dom",
        root: "ReactDOM",
      },
    },
    ...shared(),
  },

  /* ---------- ES-Module build (module) ---------- */
  {
    name: "esm",
    mode: "production",
    entry: path.resolve(__dirname, "src", "index.ts"),
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "index.esm.js",
      library: {
        type: "module",
      },
      environment: {
        module: true,
      },
      // Prevent chunk loading issues
      chunkLoading: false,
      wasmLoading: false,
    },
    experiments: {
      outputModule: true,
    },
    externalsType: "module",
    externals: {
      react: "react",
      "react-dom": "react-dom",
    },
    ...shared(),
  },
];

function shared() {
  return {
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        react: path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
      },
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: {
                      esmodules: true,
                    },
                  },
                ],
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
                "@babel/preset-typescript",
              ],
            },
          },
        },
        {
          test: /\.module\.s[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[hash:base64:6]",
                },
                importLoaders: 1,
              },
            },
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
                sassOptions: {
                  fiber: false,
                },
              },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/,
          exclude: /\.module\.s[ac]ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
              options: {
                implementation: require("sass"),
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          issuer: /\.[jt]sx?$/,
          use: ["@svgr/webpack"],
        },
        {
          test: /\.(png|jpe?g|gif|ico)$/i,
          type: "asset/inline",
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "styles.css",
      }),
      new ProvidePlugin({
        React: "react",
      }),
    ],
    optimization: {
      minimize: true,
      nodeEnv: "production",
      // Disable code splitting for library builds
      splitChunks: false,
      runtimeChunk: false,
      // Ensure all modules are bundled together
      concatenateModules: true,
    },
    // Ensure proper module resolution
    resolveLoader: {
      modules: ["node_modules"],
    },
  };
}
