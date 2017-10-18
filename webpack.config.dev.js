const fs = require('fs')
const path = require('path')
const webpack = require('webpack')

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
process.env.NODE_ENV = 'development'
const entry = packageJson.pages.reduce((prev, curr) => {
  return Object.assign(prev, {
    [curr]: [`./${curr}/index`, 'webpack-hot-middleware/client?reload=true']
  })
}, {})
module.exports = {
  devtool: 'inline-source-map',
  // devtool: '#cheap-module-eval-source-map',
  context: path.join(__dirname, 'src'),
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name].bundle.js',
    publicPath: 'http://localhost:3100/'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/, exclude: /node_modules/, use: ['babel-loader']
      }, {
        test: /\.css$/, exclude: /node_modules/, use: ['style-loader', 'css-loader']
      }, {
        test: /\.less$/, exclude: /node_modules/, use: ['style-loader', 'css-loader', 'less-loader']
      }, {
        test: /\.png|jpe?g|gif$/,
        use: ['url-loader?limit=1'],
        include: path.join(__dirname, 'src/img')
      }, {
        test: /\.(svg|eot|ttf|woff|woff2)$/,
        use: ['url-loader?limit=1'],
        include: path.join(__dirname, 'src/common/fonts')
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      DEBUG: true,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    })
  ]
}
