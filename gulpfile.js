const gulp = require('gulp')
const del = require('del')
const jsmin = require('gulp-babel-minify')
const cssmin = require('gulp-cssmin')
const htmlmin = require('gulp-htmlmin')
const zip = require('gulp-zip')
const runSequence = require('run-sequence')
const manifest = require('./manifest.json')

gulp.task('htmlmin', () => {
  return gulp.src('build/popup.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest('build'))
})

gulp.task('jsmin', () => {
  return gulp.src('build/js/script.js')
    .pipe(jsmin({
      mangle: {
        keepClassName: true
      }
    }))
    .pipe(gulp.dest('build/js'))
})

gulp.task('cssmin', () => {
  return gulp.src('build/css/style.css')
    .pipe(cssmin())
    .pipe(gulp.dest('build/css'))
})

gulp.task('copy', () => {
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
})

gulp.task('zip', () => {
  return gulp.src('build/**', {
    base: 'build'
  })
  .pipe(zip(`atoyomi_${manifest.version}.zip`))
  .pipe(gulp.dest('release'))
})

gulp.task('clean', () => {
  return del([
    'build'
  ])
})

gulp.task('build', () => {
  runSequence(
    'copy',
    'htmlmin',
    'cssmin',
    'jsmin',
    'zip',
    'clean'
  )
})