const fs = require('fs')

const gulp = require('gulp')
const gutil = require('gulp-util')
const rimraf = require('rimraf')
const rename = require('gulp-rename')
const htmlmin = require('gulp-htmlmin')
const htmlreplace = require('gulp-html-replace')
const webpackStream = require('webpack-stream')

const webpackConfig = require('./webpack.config.prod')

let webpackStats = null

gulp.task('clean', (cb) => {
  rimraf('dist', (err) => {
    if (err) {
      throw new gutil.PluginError('clean', err)
    }
    cb()
  })
})

gulp.task('assets', ['clean'], () => {
  return gulp.src('src/**/index.js')
    .pipe(webpackStream(webpackConfig, null, (err, stats) => {
      webpackStats = stats.toJson({
        chunks: true,
        modules: true,
        chunkModules: true,
        reasons: true,
        cached: true,
        cachedAssets: true
      })
      return fs.writeFile('./analyse.log', JSON.stringify(webpackStats), null, 2)
    })).pipe(gulp.dest('dist'))
})

gulp.task('img', ['clean'], () => {
  return gulp.src('src/imgs/*.*')
    .pipe(gulp.dest('dist/imgs'))
})

gulp.task('asserts-js', ['clean'], () => {
  return gulp.src('asserts/*.*')
    .pipe(gulp.dest('dist/js'))
})

gulp.task('build', ['assets', 'img', 'asserts-js'], () => {
  const assetsNames = webpackStats.assetsByChunkName
  /* eslint-disable */
  let replacement = {}
  for (const key of Object.keys(assetsNames)) {
    let style = ''
    let script = ''
    if (typeof assetsNames[key] === 'string') {
      script = assetsNames[key]
    } else {
      script = assetsNames[key][0]
      style = assetsNames[key][1]
      if (!style.match(/css$/)) {
        style = assetsNames[key][0]
        script = assetsNames[key][1]
      }
    }
    if (style) {
      replacement[`${key}Style`] = `/${style}`
    }
    if (script) {
      replacement[`${key}Script`] = `/${script}`
    }
  }
  /* eslint-enable */
  return gulp.src('src/**/index.html')
    .pipe(htmlreplace(replacement))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true,
    }))
    .pipe(rename((path) => {
      /* eslint-disable no-param-reassign */
      path.basename = path.dirname
      path.dirname = ''
      /* eslint-enable no-param-reassign */
    }))
    .pipe(gulp.dest('dist'))
})
