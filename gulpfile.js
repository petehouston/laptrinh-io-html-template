var gulp = require('gulp');
var jade = require('gulp-jade');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var runsequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var bsReload = browserSync.reload;


gulp.task('images', function () {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('build/img'));
});

gulp.task('scripts', function () {
    return gulp.src('src/scripts/**/*')
        .pipe(gulp.dest('build/js'));
});

gulp.task('vendor', function () {
    return gulp.src('src/vendor/**/*')
        .pipe(gulp.dest('build/vendor'));
});

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

gulp.task('sass', function () {
    return gulp.src('src/scss/pages/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.write('./'))
        // .pipe(autoprefixer())
        .pipe(gulp.dest('build/css'))
        .pipe(bsReload({stream: true}));
});

gulp.task('html', function () {
    return gulp.src('src/templates/pages/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('build'))
        .pipe(bsReload({stream: true}));
});

gulp.task('clean', function () {
    return del([
        'build'
    ]);
});

gulp.task('build:static', ['images', 'vendor']);
gulp.task('build:src', ['html', 'scripts', 'sass']);

gulp.task('build', ['build:static', 'build:src']);

gulp.task('default', function () {
    runsequence('clean', 'build');
});

gulp.task('serve', ['build'], function () {
    browserSync.init({
        injectChanges: true,
        server: './build'
    });

    gulp.watch('src/scss/**/*.scss', ['sass']).on('change', bsReload);
    gulp.watch('src/templates/**/*.jade', ['html']).on('change', bsReload);
});
