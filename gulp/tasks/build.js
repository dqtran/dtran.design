'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var fs = require('fs');

gulp.task('build', function (callback) {

	makeTempDir();

	runSequence('clean', 'iconfont', ['browserify', 'styles', 'images', 'components', 'nunjucks'], callback);
});

gulp.task('deploy', function (callback) {

	makeTempDir();

	runSequence('iconfont', ['styles', 'images', 'components', 'nunjucks'], 'browserify', callback);
});


function makeTempDir(){
	var dir = __dirname + '/../../.tmp';

	if (!fs.existsSync(dir)){
	    fs.mkdirSync(dir);
	}
}