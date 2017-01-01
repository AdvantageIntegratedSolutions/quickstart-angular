var gulp = require('gulp');
var watchify = require('watchify');
var browserify = require('browserify');
var babelify = require('babelify');
var inject = require('gulp-inject-string');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');

var browserSync = require('../lib/browser-sync');
var interceptErrors = require('../lib/intercept-errors');
var quickbaseConfig = require('../../config/quickbase.config');

gulp.task('js-dev', ['templates'], function () {
  return bundleJavascript();
});

gulp.task('templates', function() {
  return gulp.src('./app/**/!(index).html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(templateCache('templates.js', {
      module: 'templates',
      standalone: true
    }))
    .pipe(gulp.dest('tmp/'));
});

watchify.args.debug = true;
var bundler = watchify(browserify('./app/main.js', watchify.args));
bundler.transform(babelify, {presets: ['es2015']});
bundler.on('update', bundleJavascript);

function bundleJavascript() {
  console.log('\tCompiling JS...');

  var password = quickbaseConfig.password ? quickbaseConfig.password : process.env.GULPPASSWORD;
  var injectedPasswordString = 'password: \"' + password + '\",\n';

  return bundler.bundle()
    .on('error', interceptErrors)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(inject.before('databaseId:', injectedPasswordString))
    .pipe(gulp.dest('./tmp'))
    .pipe(browserSync.stream({once: true}));
}