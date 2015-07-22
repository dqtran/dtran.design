'use strict';

var gulp = require('gulp'),
	livereload = require('gulp-livereload');

gulp.task('watch', function () {

	// Watch .scss files
	gulp.watch('./client/styles/**/*', ['styles']);
	
	// Watch .js files
	gulp.watch('./client/js/**/*.js', ['browserify']);

	// Watch template files
	gulp.watch('./client/js/templates/**/*.html', ['nunjucks']);
	
	// Watch image files
	gulp.watch('./client/images/**/*', ['images']);

	// Watch icon files
	gulp.watch('./client/icons/**/*.svg', ['iconfont']);

	// Watch component files
	gulp.watch('./client/components/**/*', ['components']);
	
	// Create LiveReload server
	livereload.listen();
	
	// Watch any files in dist/, reload on change
	gulp.watch(['./.tmp/**']).on('change', livereload.changed);

});
