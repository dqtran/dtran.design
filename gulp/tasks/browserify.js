'use strict';

var gulp = require('gulp');
var browserify = require('browserify');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');

gulp.task('browserify', function () {
	var browserified = transform(function (filename) {

		var opts = {
			debug: true
		};

		var b = browserify(filename, opts);
		return b.bundle();
	});
  
	return gulp.src('./client/js/*.js')
		.pipe(browserified)
		// .pipe(uglify()) // TODO: pip multiple versions 
		.pipe(gulp.dest('.tmp/public/js'))
		.on('error', function (err) { 
			console.log(err.stack); 
			console.log(err.message); 
		});
});