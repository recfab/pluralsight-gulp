var gulp = require("gulp");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");

gulp.task("vet", () => {
    return gulp
    .src([
        "./src/**/*.js",
        "./*.js"
    ])
    .pipe(jscs())
    .pipe(jscs.reporter("jscs-stylish"))
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish", { verbose: true }));
});