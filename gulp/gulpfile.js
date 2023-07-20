const gulp = require('gulp');
const watch = require('gulp-watch');
const uglify = require('gulp-uglify');
const htmlmin = require('gulp-htmlmin');
const autoprefixer = require('gulp-autoprefixer');


gulp.task('scripts', () => {
  return gulp.src('src/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
});


gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});


gulp.task('styles', () => {
  return gulp.src('src/css/*.css')
    .pipe(autoprefixer())
    .pipe(gulp.dest('dist/css'));
});


gulp.task('watch', () => {
  gulp.watch('src/js/*.js', gulp.series('scripts'));
  gulp.watch('src/*.html', gulp.series('html'));
  gulp.watch('src/css/*.css', gulp.series('styles'));
});


gulp.task('default', gulp.series('scripts', 'html', 'styles', 'watch'));