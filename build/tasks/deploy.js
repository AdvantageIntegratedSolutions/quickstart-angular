var gulp = require('gulp');
var foreach = require('gulp-foreach');
var request = require('request');
var path = require('path');
var del = require('del');

var paths = require('../paths');
var quickbaseConfig = require(paths.quickbase);

gulp.task('deploy', ['clean-prod', 'upload-to-quickbase']);

gulp.task('clean-prod', function() {
  return del(paths.outputProd);
});

gulp.task('upload-to-quickbase', ['html-prod', 'css-prod', 'js-prod'], function() {
  return gulp.src(paths.outputProd + '/*.{html,css,js}')
    .pipe(foreach(function(stream, file){
      var filename = handleXMLChars(path.basename(file.path));
      var contents = handleXMLChars(file.contents.toString());
      var data = buildPage(contents, filename);

      sendQBRequest("API_AddReplaceDBPage", data).then(res => {
        console.log(res)
      }).catch(err => {
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