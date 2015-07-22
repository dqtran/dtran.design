'use strict';

var gulp = require('gulp');
var webpack = require('gulp-webpack');
var uglify = require('gulp-uglify');

gulp.task('webpack', function () {
  
	return gulp.src('./client/js/*.js')
		.pipe(webpack({
			watch: true,
			output: {
	        filename: '[name].js',
	      }
		}))
		.pipe(uglify())
		.pipe(gulp.dest('.tmp/public/js/'))
		.on('error', function (err) { 
			console.log(err.stack); 
			console.log(err.message); 
		});
});