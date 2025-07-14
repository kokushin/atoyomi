const gulp = require('gulp')
const del = require('del')
const terser = require('gulp-terser')
const cleanCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
const zip = require('gulp-zip')
const manifest = require('./manifest.json')

function htmlMinify() {
  return gulp.src('build/popup.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('build'))
}

function jsMinify() {
  return gulp.src('build/js/script.js')
    .pipe(terser({
      mangle: {
        keep_classnames: true
      }
    }))
    .pipe(gulp.dest('build/js'))
}

function cssMinify() {
  return gulp.src('build/css/style.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/css'))
}

function copyFiles() {
  return gulp.src(
    [
      '_locales/**',
      'popup.html',
      'icon.png',
      'manifest.json',
      'css/style.css',
      'js/script.js'
    ],
    {
      base: './'
    }
  )
  .pipe(
    gulp.dest('build')
  )
}

function createZip() {
  return gulp.src('build/**', {
    base: 'build'
  })
  .pipe(zip(`atoyomi_${manifest.version}.zip`))
  .pipe(gulp.dest('release'))
}

function cleanBuild() {
  return del([
    'build'
  ])
}

const build = gulp.series(
  copyFiles,
  gulp.parallel(htmlMinify, cssMinify, jsMinify),
  createZip,
  cleanBuild
)

const buildDev = gulp.series(
  copyFiles,
  gulp.parallel(htmlMinify, cssMinify, jsMinify)
)

exports.htmlmin = htmlMinify
exports.jsmin = jsMinify
exports.cssmin = cssMinify
exports.copy = copyFiles
exports.zip = createZip
exports.clean = cleanBuild
exports.build = build
exports.dev = buildDev
exports.default = build