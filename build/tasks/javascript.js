// var gulp = require('gulp');
// // var uglify = require('gulp-uglify');
// var inject = require('gulp-inject-string');
// var browserify = require('browserify');
// var babelify = require('babelify');
// var source = require('vinyl-source-stream');
// // var buffer = require('vinyl-buffer');
// var notify = require('gulp-notify');
//
// var paths = require('../paths');
// var app = require(paths.app);
// var quickbase = require(paths.quickbase);
//
// function interceptErrors(error) {
//   var args = Array.prototype.slice.call(arguments);
//
//   // Send error to notification center with gulp-notify
//   notify.onError({
//     title: 'Compile Error',
//     message: '<%= error.message %>'
//   }).apply(this, args);
//
//   // Keep gulp from hanging on this task
//   this.emit('end');
// };
//
// gulp.task('add-auth-to-local', ['js-dev'], function(){
//   var password = process.env.GULPPASSWORD;
//   if(quickbase.password){
//     password = quickbase.password;
//   };
//
//   return gulp.src(paths.outputDev + '/bundle.js')
//     .pipe(inject.before('databaseId:', 'username: \"'+quickbase.username+'\",\n password: \"'+password+'\",\n realm: \"'+quickbase.realm+'\",\n\t'))
//     .pipe(gulp.dest(paths.outputDev));
// });
//
// gulp.task('js-dev', ['templates'], function(){
//   return browserify(app.bootstrap, {debug: true})
//     .transform(babelify, {presets: ['es2015']})
//     .bundle()
//     .on('error', interceptErrors)
//     .pipe(source('bundle.js'))
//     .pipe(gulp.dest(paths.outputDev));
// });
//
// gulp.task('js-prod', ['templates'], function(){
//   return browserify(app.bootstrap)
//     .transform(babelify, {presets: ['es2015']})
//     .bundle()
//     .on('error', interceptErrors)
//     .pipe(source(app.name + '-bundle.js'))
//     // .pipe(buffer())
//     // .pipe(uglify())
//     .pipe(gulp.dest(paths.outputProd));
// });
//
