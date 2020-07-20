const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            },
        }, 'css-loader'
    ];

    if(extra) {
        loaders.push(extra)
    }

    return loaders;
};

const jsOptions = jsType => {
  const options = {
          presets: [
              '@babel/preset-env',
          ],
          plugins: [
              '@babel/plugin-proposal-class-properties'
          ]
  };

  if(jsType) {
      options.presets.push(jsType)
  }

  return options;
};

const optimization =() => {
    const config = {
        splitChunks: {
            chunks: 'all'
        }
    };

    if(isProd) {
        config.minimizer = [
            new OptimizeCssAssetsPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
};

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`;

module.exports = {
    context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
      main: ['@babel/polyfill', './index.jsx'],
      analytics: './analytics.ts'
  },
  output: {
      filename: filename('js'),
      path: path.resolve(__dirname, 'dist')
  },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        alias: {
            '@assets': path.resolve(__dirname, './src/assets')
        }
    },
    optimization: optimization(),
    devServer: {
      port: 4200,
      hot: isDev
    },
    devtool: isDev ? 'source-map' : '',
    plugins: [
      new HTMLWebpackPlugin({
          template: './index.html',
          minify: {
              collapseWhitespace: isProd,
          }
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
          patterns: [
              {
                  from: path.resolve(__dirname, './src/favicon.ico'),
                  to: path.resolve(__dirname, 'dist/favicon.ico')
              }
          ]
      }),
      new MiniCssExtractPlugin({
          filename: filename('css')
      }),
  ],
  module: {
        rules: [
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.(png|.jpg|.svg|.gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: jsOptions()
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: jsOptions('@babel/preset-typescript')
                }
            },
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: {
                    loader: 'babel-loader',
                    options: jsOptions('@babel/preset-react')
                }
            },
        ],
  }
};