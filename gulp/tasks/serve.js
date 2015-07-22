'use strict';

var gulp = require('gulp'),
	nodemon = require('gulp-nodemon');

gulp.task('serve', ['build'], function(){
	nodemon({
			watch: ['server/'],
			ext: 'html js',
			nodeArgs: ['--debug'],
			ignore: ['gulpfile.js', 'newrelic.js', '.git', '.sass-cache', 'client', 'gulp', 'node_modules/**/node_modules', '.tmp', 'utils', 'server/jobs', 'worker.js', '.settings', 'typings', 'utils'],
			verbose: true
		})
		.on('restart', function () {
			console.log('nodemon server restarted!');
			// TODO: Would be nice to add live reload here.
			// However there is a bug with gulp-nodemon currently:
			// https://github.com/JacksonGariety/gulp-nodemon/issues/40
		});
});

