var gulp = require('gulp');

gulp.task('html-dev', function() {
  return gulp.src('./app/index.html')
    .pipe(gulp.dest('./tmp'));
});