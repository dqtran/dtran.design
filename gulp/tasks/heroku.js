'use strict';

var gulp = require('gulp');

gulp.task('heroku:production', ['build']);
gulp.task('heroku:development', ['build']);