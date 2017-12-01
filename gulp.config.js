var path = require("path");

module.exports = function () {
    var client = "./src/client";
    var clientApp = path.join(client, "app");
    var server = "./src/server";
    var temp = "./.tmp";

    var config = {

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
        server: server,
        temp: temp,

        /**
         * Bower and NPM locations
         */
        bower: {
            json: require("./bower.json"),
            directory: "./bower_components",
            ignorePath: "../.."
        },

        /**
         * Node settings
         */
        defaultPort: 7203,
        nodeServer: path.join(server, "app.js")
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
