var gulp = require('gulp'),
    strip = require('gulp-strip-comments'),
    concat = require('gulp-concat'),
    plumber = require('gulp-plumber'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    minifyCSS = require('gulp-minify-css'),
    image = require('gulp-image'),
    sass = require('gulp-sass');

var gulpPaths = {
    "bc": "./bower_components/",
    "js": "./src/js/",
    "sass": "./src/scss/",
    "dist": "./dist/",
};

function app() {
    return gulp.src([
        gulpPaths.js + '**/*.js'
    ])
    .pipe(strip())
    .pipe(concat('app.js'))
    .pipe(gulp.dest(gulpPaths.dist + 'js'));
}

function vendor() {
    return gulp.src([
        gulpPaths.bc + 'jquery/dist/jquery.min.js',
        gulpPaths.bc + 'popper.js/dist/umd/popper.min.js',
        gulpPaths.bc + 'bootstrap-material-design/js/bootstrap-material-design.min.js',
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(gulpPaths.dist + 'js'));
}

function msass() {
    return gulp.src([
        gulpPaths.sass + 'main.scss'
    ])
    .pipe(sass().on('error', sass.logError))
    .pipe(plumber())
    .pipe(rename('app.css'))
    .pipe(gulp.dest(gulpPaths.dist+'css'));
}

function style() {
    return gulp.src([
        gulpPaths.bc + 'bootstrap-material-design/css/bootstrap-material-design.min.css',
    ])
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(gulpPaths.dist+'css'))
}


gulp.task('app', app);
gulp.task('vendor', vendor);
gulp.task('sass', msass);
gulp.task('style', style);

gulp.task('default', [ 'style', 'sass',  'vendor', 'app', 'watch', 'serve']);

gulp.task('watch', function () {
    gulp.watch(gulpPaths.sass + '*.scss', ['sass']);
    gulp.watch(gulpPaths.js + '**/*.js', ['app']);
})

gulp.task('serve', function () {
    var http = require('http');
    var statics = require('node-static');
    var fs = require('fs');

    var st = new statics.Server('./', {cache: -1});

    console.log('Development server started a http://localhost:3008');

    http.createServer(function (req, res) {
        st.serve(req, res);
    }).listen(3008);
});