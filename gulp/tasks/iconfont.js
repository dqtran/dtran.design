'use strict';

var gulp = require('gulp');
var iconfont = require('gulp-iconfont');
var consolidate = require('gulp-consolidate');

gulp.task('iconfont', function(){
	gulp.src(['./client/icons/*.svg'])
		.pipe(iconfont({
			fontName: 'iconfont', // required
			appendCodepoints: true, // recommended option
            normalize: true
		}))
		.on('codepoints', function(codepoints, options) {
            codepoints.forEach(function(glyph, idx, arr) {
                arr[idx].codepoint = glyph.codepoint.toString(16);
            });
            gulp.src('./gulp/templates/_icons.scss')
                .pipe(consolidate('underscore', {
                    glyphs: codepoints,
                    fontName: options.fontName,
                    fontPath: '../fonts/icons/'
                }))
                .pipe(gulp.dest('./client/styles/base'))
                .on('error', function (err) { console.log(err.stack); });
		})
		.pipe(gulp.dest('.tmp/public/fonts/icons'))
        .on('error', function (err) { console.log(err.stack); });
});