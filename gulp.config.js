var path = require("path");

module.exports = function () {
    var client = "./src/client";

    var config = {
        temp: "./.tmp",

        /**
         * File paths
         */
        alljs: [
            "./src/**/*.js",
            "./*.js"
        ],

        less: path.join(client, "styles", "styles.less")
    };

    return config;
};
