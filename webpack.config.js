// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const ejs = require("ejs");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const browsers = ['chrome', 'firefox', 'edge'];

const createBrowserConfig = (browser) => {
  return {
    mode: isProduction ? "production" : "development",
    entry: {
      popup: path.resolve(__dirname, "src/popup/popup.ts"),
    },
    output: {
      path: path.resolve(__dirname, 'dist', browser),
      filename: "[name]/[name].js",
    },
    devtool: false, // not to use eval in debug build
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: "src",
            globOptions: {
              ignore: ["**/*.ts", "**/*.ejs"],
            },
          },
          {
            from: "src/*.ejs",
            to: ({ context, absoluteFilename }) => {
              // Remove '.ejs' extension from output file
              const newFileName = path.basename(absoluteFilename, ".ejs");
              return path.join(context, "dist", browser, newFileName);
            },
            transform: async (content) => {
              const data = {
                version: "1.0.1",
                browser: browser,
              };

              // Render the EJS template
              return ejs.render(content.toString(), data);
            },
          },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/i,
          loader: "ts-loader",
          exclude: ["/node_modules/"],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin(),
        new HtmlMinimizerPlugin(),
        new CssMinimizerPlugin(),
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
  };
};

module.exports = browsers.map(createBrowserConfig);
