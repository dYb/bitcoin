const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
const entry = packageJson.pages.reduce((prev, curr) => {
  return Object.assign(prev, {
    [curr]: [`./${curr}/index`]
  })
}, {})
process.env.NODE_ENV = 'production'

module.exports = {
  context: path.join(__dirname, 'src'),
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].[chunkhash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }, {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?importLoaders=1', 'postcss-loader']
        })
      }, {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?importLoaders=1', 'postcss-loader', 'less-loader']
        })
      }, {
        test: /\.png|jpe?g|gif$/,
        use: 'url-loader?limit=5000&name=img/[hash].[ext]',
        include: path.join(__dirname, 'src/img')
      }, {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        use: ['url-loader?limit=5000&name=fonts/[hash].[ext]'],
        include: path.join(__dirname, 'src/common/fonts')
      }
    ]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new ExtractTextPlugin('css/[name].[contenthash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.NoErrorsPlugin()
  ]
}
