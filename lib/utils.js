var
    fs = require('fs'),
    _path = require("path"),
    _ = require('lodash'),

    utils = {
        readFile: function(path) {
            return fs.existsSync(path) && fs.readFileSync(path).toString();
        },

        readJson: function(path) {
            return JSON.parse(this.readFile(path));
        },

        readdirSync: function(path) {
            return fs.existsSync(path) && fs.readdirSync(path);
        },

        isFile: function(path) {
            return fs.existsSync(path) && fs.statSync(path).isFile();
        },

        isDirectory: function(path) {
            return fs.existsSync(path) && fs.statSync(path).isDirectory();
        },

        existsSync: function(path) {
            return fs.existsSync(path);
        },

        resolve: function(path) {
            return _path.resolve(path);
        },

        getBase: function(file) {
            return _path.dirname(file);
        },

        userhome: process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,

        merge: _.merge,
        clone: _.clone,
        mapValues: _.mapValues,
        forOwn: _.forOwn,
        has: _.has,
        transform: _.transform,
        forEach: _.forEach
    };

module.exports = utils;
