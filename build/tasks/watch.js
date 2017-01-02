var gulp = require('gulp');
var del = require('del');
var fs = require('fs');

var browserSync = require('../lib/browser-sync');
var paths = require('../paths');
var QuickbaseApi = require('../lib/api-client');

gulp.task('local', ['watch']);
gulp.task('watch', ['clean-dev', 'upload-config', 'html-dev', 'css-dev', 'js-dev'], function () {
  browserSync.init({
    open: false,
    reloadOnRestart: true,
    server: paths.outputDev,
    notify: false
  });

  gulp.watch(paths.templates, ['templates'], browserSync.reload);
  gulp.watch(paths.css, ['css-dev']);
  gulp.watch('config/quickbase.config.js', ['upload-config']);
});

gulp.task('clean-dev', function() {
  return del(paths.outputDev);
});

gulp.task('upload-config', function() {
  // We have to read the file at runtime instead of using the 'require'ing the file because Node caches that garbage and we need the new changes.
  var config = fs.readFileSync('config/quickbase.config.js', 'utf-8');
  config = eval(config);
  config.password = config.password || process.env.GULPPASSWORD;

  var quickbaseClient = new QuickbaseApi(config);

  quickbaseClient.uploadVariable(JSON.stringify(config))
    .then(res => console.log(`\t   Variable uploaded`))
    .catch(err => console.error(`\t   Error uploading variable:\n${err}`));

  this.emit('end');
});