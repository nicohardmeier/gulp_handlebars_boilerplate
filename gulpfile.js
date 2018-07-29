const gulp = require('gulp');
const gutil = require('gulp-util');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var minifyCSS = require('gulp-minify-css');
var browserSync = require('browser-sync').create();
var handlebars = require('gulp-compile-handlebars');
var rename = require('gulp-rename');

var paths = {
    src: './src/**/*',
    dist: 'dist'
  };


gulp.task('default', ['watch','browser-sync']);

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src('src/js/**/*.js')
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'));
  });

// configure which files to watch and what tasks to use on file changes
gulp.task('watch', function() {
    gulp.watch('src/js/**/*.js', ['jshint']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
    gulp.watch('src/views/**/*.handlebars', ['handlebars']);


  });

//compile and copy sass to css
gulp.task('sass', function() {
    return gulp.src('./src/scss/style.scss')
        .pipe(sourcemaps.init())
		.pipe(sass({
            compress: true
        }))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('./src/css'));
});

// Handlebars compile
gulp.task('handlebars',  function() {
    return gulp.src('src/views/index.handlebars')
        .pipe(handlebars())
        .pipe(rename('index.html'))
        .pipe(gulp.dest('src'));

});


// Static Server + watching scss/html files
gulp.task('serve', ['sass','handlebars','watch'], function() {
    browserSync.init({
        server: "./src"
    });
    gulp.watch("src/scss/*.scss", ['sass']);
    gulp.watch("src/*.html").on('change', browserSync.reload);
});
  
//build dist folder
gulp.task('build', function() {
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist'));
    gulp.src('./src/js/vendor/**/*.*')
        .pipe(gulp.dest('./dist/js/vendor'));
    gulp.src('./src/css/*.*')
        .pipe(gulp.dest('./dist/css'));
    gulp.src('./src/img/*.*')
        .pipe(gulp.dest('./dist/img'));
});

