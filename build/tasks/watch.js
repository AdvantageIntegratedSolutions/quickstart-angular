var gulp = require('gulp');
var del = require('del');

var browserSync = require('../lib/browser-sync');

gulp.task('local', ['watch']);
gulp.task('watch', ['clean-dev', 'html-dev', 'css-dev', 'js-dev'], function () {
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
  return del('./tmp/**/*');
});