'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var nunjucks = require('gulp-nunjucks');

gulp.task('nunjucks', function () {
    return gulp.src('./client/js/templates/*.html')
        .pipe(nunjucks())
        .pipe(concat('templates.js'))
        .pipe(gulp.dest('.tmp/public/js'))
        .on('error', function (err) { console.log(err.stack); });
});