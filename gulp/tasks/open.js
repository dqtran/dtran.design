var gulp = require('gulp');
var open = require('gulp-open');

gulp.task('url', function(){
  var options = {
    url: 'http://localhost:4832',
    app: 'chrome'
  };
  gulp.src('./index.html')
  .pipe(open('', options));
});