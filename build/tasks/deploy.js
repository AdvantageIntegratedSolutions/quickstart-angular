// var gulp = require('gulp');
// var replace = require('gulp-replace');
// var insert = require('gulp-insert');
//
// var paths = require('../paths');
// var app = require(paths.app);
//
// var deployTasks = [
//   'js-prod',
//   'css-prod',
//   'html-prod',
//   'upload-assets',
//   'upload-html'
// ];
//
// gulp.task('deploy', function() {
//   gulp.start.apply(this, deployTasks);
// });
//
// //git init repo
// gulp.task('init', function(){
//   gulp.start(['update-readme']);
// });
//
// gulp.task('update-readme', function(){
//   gulp.src(['README.md'])
//     .pipe(replace(/.*\n?/g, ''))
//     .pipe(insert.append("# " + app.name + "\n"))
//     .pipe(insert.append("#### Description: " + app.description + "\n"))
//     .pipe(insert.append("#### Client: " + app.client + "\n"))
//     .pipe(insert.append("#### Authors: " + app.authors))
//     .pipe(gulp.dest('.'));
// });