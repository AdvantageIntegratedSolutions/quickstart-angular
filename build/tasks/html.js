var gulp = require('gulp');
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var replace = require('gulp-replace');

var quickbaseConfig = require('../../config/quickbase.config');
var appConfig = require('../../config/app.config');

gulp.task('html-dev', function() {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./tmp'));
});

gulp.task('html-prod', function() {
	var pageUrl = 'https://' + quickbaseConfig.realm + '.quickbase.com/db/' + quickbaseConfig.databaseId + '?a=dbpage&pagename=' + appConfig.name + '-bundle';

  return gulp.src('./app/index.html')
  	.pipe(replace(/bundle\.js/, pageUrl + 'js'))
    .pipe(replace(/bundle\.css/, pageUrl + 'css'))
    .pipe(rename(function (path) {
      path.basename = appConfig.name + "-" + path.basename;
      path.dirname = "";
    }))
    .pipe(insert.prepend('<!-- ' + appConfig.origin + ' -->\n'))
    .pipe(gulp.dest('./dist'));
});