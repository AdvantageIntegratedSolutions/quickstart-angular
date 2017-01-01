var gulp = require('gulp');
var del = require('del');

var browserSync = require('../lib/browser-sync');
var paths = require('../paths');

gulp.task('local', ['watch']);
gulp.task('watch', ['clean-dev', 'html-dev', 'css-dev', 'js-dev'], function () {
  browserSync.init({
    open: false,
    reloadOnRestart: true,
    server: paths.outputDev,
    notify: false
  });

  gulp.watch(paths.templates, ['templates'], browserSync.reload);
  gulp.watch(paths.css, ['css-dev']);
});

gulp.task('clean-dev', function() {
  return del(paths.outputDev);
});