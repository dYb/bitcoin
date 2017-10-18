const path = require('path')
const express = require('express')
const webpack = require('webpack')
const config = require('./webpack.config.dev')

const app = express()
const compiler = webpack(config)

app.use(express.static('mocks', {
  setHeaders(res) {
    res.set('Access-Control-Allow-Origin', '*')
  }
}))
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath,
  stats: {
    colors: true
  }
}))

app.use(require('webpack-hot-middleware')(compiler))

app.get('/page/:type', (req, res, next) => {
  if (!req.params.type.match(/map$/)) {
    res.sendFile(path.join(__dirname, 'src', req.params.type, 'index.html'))
  } else {
    next()
  }
})

app.listen(3100, (err) => {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:3100')
})
