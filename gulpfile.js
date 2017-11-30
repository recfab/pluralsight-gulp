var gulp = require("gulp");
var args = require("yargs").argv;
var del = require("del");
var path = require("path");

var config = require("./gulp.config")();

// load plugins as needed
// e.g. $.if will load "gulp-if"
var $ = require("gulp-load-plugins")({ lazy: true });

// So we don't need these lines
// var jshint = require("gulp-jshint");
// var jscs = require("gulp-jscs");
// var util = require("gulp-util");
// var gulpprint = require("gulp-print");
// var gulpif = require("gulp-if");

gulp.task("vet", () => {
    log("Analyzing source with JSHint and JSCS");

    return gulp
    .src(config.alljs)
    .pipe($.if(args.verbose, $.print()))
    .pipe($.jscs())
    .pipe($.jscs.reporter("jscs-stylish"))
    .pipe($.jshint())
    .pipe($.jshint.reporter("jshint-stylish", { verbose: true }))
    .pipe($.jshint.reporter("fail"));
});

gulp.task("styles", ["clean-styles"], () => {
    log("Compiling LESS --> CSS");
    log("    path: " + config.less);

    return gulp
        .src(config.less)
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ["last 2 version", "> 5%"]}))
        .pipe(gulp.dest(config.temp));
});

gulp.task("clean-styles", (done) => {
    var files = path.join(config.temp, "**/*.css");
    return clean(files, done);
});

//////////////

function clean(path) {
    log("Cleaning: " + $.util.colors.blue(path));
    return del(path);
}

function log(msg) {
    if (typeof(msg) === "object") {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    }
    else {
        $.util.log($.util.colors.blue(msg));
    }
}
