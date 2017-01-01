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

gulp.task('index', function() {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./tmp'));
});

gulp.task('styles', function() {
  return gulp.src('./app/**/*.{css,scss,sass}')
    .pipe(sass())
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(concat('bundle.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./tmp'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
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
bundler.on('update', bundle);

function interceptErrors(error) {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
}

function bundle() {
  console.log('Compiling JS...');
  return bundler.bundle()
    .on('error', interceptErrors)
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./tmp'))
    .pipe(browserSync.stream({once: true}));
}

gulp.task('bundle', ['templates'], function () {
  return bundle();
});

gulp.task('default', ['bundle', 'styles', 'index'], function () {
  browserSync.init({
    server: './tmp',
    notify: false
  });

  gulp.watch('./app/**/!(index).html', ['templates'], browserSync.reload);
  gulp.watch('./app/**/*.{css,scss,sass}', ['styles'])
});
































// /*
//   gulpfile.js
//   ===========
//   Rather than manage one giant configuration file responsible
//   for creating multiple tasks, each task has been broken out into
//   its own file in build/tasks. Any files in that directory get
//   automatically required below.
//   To add a new task, simply add a new task file that directory.
//   build/tasks/default.js specifies the default set of tasks to run
//   when you run `gulp`.
// */
//
// var requireDir = require('require-dir');
//
// // Require all tasks in build/tasks, including subfolders
// requireDir('./build/tasks', { recurse: true });