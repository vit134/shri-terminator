/*eslint no-console: 0*/
'use strict'

const gulp = require('gulp'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    cleanCSS = require('gulp-clean-css'),
    less = require('gulp-less'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer');

const path = {
    build: {
        styles: 'dist/styles/',
        scripts: 'dist/scripts/'
    },
    dev: {
        globalStyles: 'styles/global.less',
        styles: 'styles/*/*.less',
        js: 'scripts/main.js'
    }

}

gulp.task('styles', function () {
    return gulp.src([
            path.dev.globalStyles,
            path.dev.styles
        ])
        .pipe(concat('__main.less'))
        .pipe(less())
        .pipe(prefixer())
        .on('error', console.log)
        .pipe(gulp.dest(path.build.styles))
        .pipe(cleanCSS())
        .pipe(rename('_main.css'))
        .pipe(gulp.dest(path.build.styles));
});

gulp.task('scripts', function () {

    return gulp.src([path.dev.js])
        .pipe(concat('__main.js'))
        .pipe(gulp.dest(path.build.scripts))
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(rename('_main.js'))
        .pipe(gulp.dest(path.build.scripts))
});

gulp.task('build', ['scripts', 'styles'], function () {});

gulp.task('watch', function () {
    watch([
        path.dev.globalStyles,
        path.dev.styles,
        path.dev.js
    ], function (event, cb) {
        gulp.start('build');
    });
});