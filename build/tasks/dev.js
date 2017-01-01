var gulp = require('gulp');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var watchify = require('watchify');
var browserify = require('browserify');
var browserSync = require('browser-sync').create();
var templateCache = require('gulp-angular-templatecache');
var htmlmin = require('gulp-htmlmin');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var inject = require('gulp-inject-string');
var buffer = require('vinyl-buffer');
var del = require('del');

var quickbaseConfig = require('../../config/quickbase.config');

gulp.task('watch', ['dev']);
gulp.task('local', ['dev']);
gulp.task('dev', ['clean-dev', 'html-dev', 'css-dev', 'js-dev'], function () {
  browserSync.init({
    open: false,
    reloadOnRestart: true,
    server: './tmp',
    notify: false
  });

  gulp.watch('./app/**/!(index).html', ['templates'], browserSync.reload);
  gulp.watch('./app/**/*.{css,scss,sass}', ['css-dev']);
});

gulp.task('clean-dev', function() {
  return del('./tmp/**/*')
})

gulp.task('html-dev', function() {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./tmp'));
});

gulp.task('css-dev', function() {
  return gulp.src('./app/**/*.{css,scss,sass}')
    .pipe(sass())
    .on('error', interceptErrors)
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(concat('bundle.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./tmp'))
    .pipe(browserSync.stream({match: '**/*.{css,scss,sass}'}));
});

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

function interceptErrors(error) {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  this.emit('end');
}

function bundleJavascript() {
  console.log('Compiling JS...');

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