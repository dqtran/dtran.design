'use strict';

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify');

gulp.task('styles', function() {
	return gulp.src('./client/styles/*.scss')
		.pipe(sass())
		.pipe(autoprefixer('last 2 versions'))
		.pipe(gulp.dest('.tmp/public/styles'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(minifycss())
		.pipe(gulp.dest('.tmp/public/styles'))
		.pipe(notify({ message: 'Styles task complete' }))
		.on('error', function (err) { console.log(err.stack); });
});