var path = require("path");

module.exports = function () {
    var client = "./src/client";
    var clientApp = path.join(client, "app");
    var temp = "./.tmp";

    var config = {
        temp: temp,

        /**
         * File paths
         */
        alljs: [
            "./src/**/*.js",
            "./*.js"
        ],
        client: client,
        css: path.join(temp, "styles.css"),
        index: path.join(client, "index.html"),
        js: [
            path.join(clientApp, "**/*.module.js"),
            path.join(clientApp, "**/*.js"),
            "!" + path.join(clientApp, "**/*.spec.js")
        ],

        less: path.join(client, "styles", "styles.less"),

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require("./bower.json"),
            directory: "./bower_components",
            ignorePath: "../.."
        }
    };

    config.getWiredepDefaultOptions = function () {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };

    return config;
};
