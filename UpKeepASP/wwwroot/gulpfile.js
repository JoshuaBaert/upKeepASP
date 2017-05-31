/**
 * Created by Joshua Baert on 12/1/2016.
 */

var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var print = require('gulp-print');
var babel = require('gulp-babel');
var autoPrefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');


var CacheBuster = require('gulp-cachebust');
var cacheBust = new CacheBuster();


gulp.task('clean', function (cb) {
	del([
			'dist'
	],cb)
});


gulp.task('build-css', function () {
	
	return gulp.src('./styles/*')
			.pipe(sourcemaps.init())
			.pipe(sass())
			.pipe(autoPrefixer({
				browsers: ['last 8 versions'],
				cascade: false
			}))
			.pipe(cacheBust.resources())
			.pipe(concat('style.css'))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('./dist'))
//			.pipe(livereload());
});


gulp.task('build-js', function () {
	return gulp.src('js/**/*.js')
			.pipe(sourcemaps.init())
			.pipe(print())
			.pipe(babel({presets: ['es2015']}))
			.pipe(concat('bundle.js'))
			.pipe(sourcemaps.write('./maps'))
			.pipe(gulp.dest('./dist'))
			.pipe(livereload());
});

/*    */

gulp.task('build', ['clean', 'build-css', 'build-js'], function () {
	return gulp.src('index.html')
			.pipe(cacheBust.references())
			.pipe(gulp.dest('dist'))
//			.pipe(livereload());
});



gulp.task('watch', function () {
	livereload.listen();
	gulp.start('build');
	gulp.watch(['./index.html', './views/**/*.html' , './styles/*.*ss', './js/**/*.js'], ['build']);
});
