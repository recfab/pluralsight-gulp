var gulp = require("gulp");
var args = require("yargs").argv;
var del = require("del");
var path = require("path");
var browserSync = require("browser-sync");
var setTimeout = require("timers").setTimeout;

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

// NOTE: $.plumber : modifies #pipe to handler errors gracefully

var port = process.env.PORT || config.defaultPort;

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
        .pipe($.plumber())
        .pipe($.less())
        .pipe($.autoprefixer({ browsers: ["last 2 version", "> 5%"]}))
        .pipe(gulp.dest(config.temp));
});

gulp.task("clean-styles", (done) => {
    var files = path.join(config.temp, "**/*.css");
    return clean(files, done);
});

gulp.task("less-watcher", () => {
    gulp.watch(config.less, ["styles"]);
});

gulp.task("wiredep", () => {
    log("Wire up the bower css js into the html");

    var options = config.getWiredepDefaultOptions();
    var wiredep = require("wiredep").stream;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(gulp.dest(config.client));
});

gulp.task("inject", ["wiredep", "styles"], () => {

    log("Wire up the app css and js into the html");

    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});

gulp.task("serve-dev", ["inject"], () => {
    var isDev = true;

    var nodeOptions  = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            "PORT": port,
            "NODE_ENV": isDev ? "dev" : "build"
        },
        watch: config.server
    };

    return $.nodemon(nodeOptions)
        .on("restart", ["vet"], (files) => {
            log("*** nodemon restarted");
            log("files changed on restart: \n" + files);

            setTimeout(() => {
                browserSync.notify("reloading noew ...");
                browserSync.reload({ stream: false });
            }, config.browserReloadDelay); // give nodemon time to do its business
        })
        .on("start", () => {
            log("*** nodemon started");
            startBrowserSync();
        })
        .on("crash", () => {
            log("*** nodemon crashed: script crashed for some reason");
        })
        .on("exit", () => {

        });
});

//////////////

function changeEvent(event) {
    var srcPattern = new RegExp("/.*(?=/" + config.source + ")/");
    log("File " + event.path.replace(srcPattern, "") + " " + event.type);
}

function startBrowserSync() {
    if (browserSync.active) {
        return;
    }

    log("starting browser-sync on port " + port);

    gulp.watch([config.less], ["styles"])
        .on("change", changeEvent);

    var options = {
        proxy: "localhost:" + port,
        port: 3000,
        files: [
            path.join(config.client, "**/*"),
            "!" + config.less,
            path.join(config.temp, "**/*.css")
        ],
        ghostMode: {
            clicks: true,
            location: false,
            forms: true,
            scroll: true
        },
        injectChanges: true,
        logFileChanges: true,
        logLevel: "debug",
        logPrefix: "gulp-patterns",
        notify: true,
        reloadDelay: 1000
    };

    browserSync(options);
}

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
