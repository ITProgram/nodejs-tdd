'use strict';

const gulp = require('gulp');
const jest = require('gulp-jest').default;

gulp.task('tdd', ['jest'], () => {
    gulp.watch('**/*.js', ['jest']);
});

gulp.task('jest', () => {
    return gulp.src('./tests')
        .pipe(jest());
});