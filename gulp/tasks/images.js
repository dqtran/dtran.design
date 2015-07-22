'use strict';

var gulp = require('gulp');
var fs = require('fs');

gulp.task('images', function() {

	var dir = __dirname + '/../../.tmp/uploads';

	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}

	gulp.src('./client/images/**')
		.pipe(gulp.dest('.tmp/public/images'))
		.on('error', function (err) { console.log(err.stack); });
});