module.exports = {
  plugins: [
    // require('postcss-unprefix'),
    require('postcss-cssnext')({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1', 'ie > 8', 'Android >= 4.0', 'iOS > 7'],
      features: {
        rem: false
      }
    })
  ]
}
