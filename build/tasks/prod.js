var gulp = require('gulp');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
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
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var foreach = require('gulp-foreach');
var path = require('path');
var request = require('request');

var quickbaseConfig = require('../../config/quickbase.config');
var appConfig = require('../../config/app.config');

gulp.task('deploy', ['prod']);
gulp.task('prod', ['clean-prod', 'upload-to-quickbase'], function() {
  return notify({
    title: "Gulp",
    message: "Deployment successful."
  })
});

gulp.task('clean-prod', function() {
  return del('./dist/**/*')
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

gulp.task('css-prod', function() {
  return gulp.src('./app/**/*.{css,scss,sass}')
    .pipe(sass())
    .on('error', interceptErrors)
    .pipe(autoprefixer({browsers: ['last 2 versions']}))
    .pipe(concat(appConfig.name + '-bundle.css'))
    .pipe(cleanCss())
    .pipe(gulp.dest('./dist'));
});

gulp.task('js-prod', function() {
  return browserify('./app/main.js')
    .transform(babelify, {presets: ['es2015']})
    .bundle()
    .on('error', interceptErrors)
    .pipe(source(appConfig.name + '-bundle.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'));
});

gulp.task('upload-to-quickbase', ['html-prod', 'css-prod', 'js-prod'], function() {
  return gulp.src('./dist/*.{html,css,js}')
    .pipe(foreach(function(stream, file){
      var filename = handleXMLChars(path.basename(file.path));
      var contents = handleXMLChars(file.contents.toString());
      var data = buildPage(contents, filename);
      sendQBRequest("API_AddReplaceDBPage", data).catch(err => {
        console.error(err);
      });

      return stream;
    }));
});

function handleXMLChars(string){
  if (!string) return;

  return string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildPage(body, name){
  var data = [];
  var password = quickbaseConfig.password ? quickbaseConfig.password : process.env.GULPPASSWORD;

  data.push("<qdbapi>");
  data.push("<apptoken>" + handleXMLChars(quickbaseConfig.token) + "</apptoken>");
  data.push("<username>" + handleXMLChars(quickbaseConfig.username) + "</username>");
  data.push("<password>" + handleXMLChars(password) + "</password>");
  data.push("<hours>" + "1" + "</hours>");
  data.push("<pagebody>" + body + "</pagebody>");
  data.push("<pagetype>" + "1" + "</pagetype>");
  data.push("<pagename>" + name + "</pagename>");
  data.push("</qdbapi>");

  return data.join("");
}

function sendQBRequest(action, data, mainAPICall){
  var dbid = mainAPICall ? "main" : quickbaseConfig.databaseId;
  var url = "https://" + quickbaseConfig.realm + ".quickbase.com/db/" + dbid + "?act=" + action;

  return new Promise(function(resolve, reject) {
    request({
      url: url,
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': 'application/xml',
        'QUICKBASE-ACTION': action
      }
    }, function(err, res, body) {
      if (err) reject(err);

      var errCode = +body.match(/<errcode>(.*)<\/errcode>/)[1];
      if (errCode != 0) {
        reject(body);
      } else {
        resolve(body);
      }
    });
  });
}

function interceptErrors(error) {
  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  this.emit('end');
}