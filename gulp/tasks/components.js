'use strict';

var gulp = require('gulp');

gulp.task('components', function() {
	gulp.src('./client/components/**')
		.pipe(gulp.dest('.tmp/public/components'))
		.on('error', function (err) { console.log(err.stack); });
});