var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    shell = require('gulp-shell');

gulp.task('install-bower-packages', function () {
    return gulp.src('').pipe(shell('"./node_modules/.bin/bower" install --allow-root'));
});

gulp.task('minify', function() {
    return gulp.src('./fixedTableHeader.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./'));
});

gulp.task('build', ['install-bower-packages', 'minify'], function() {
    
});