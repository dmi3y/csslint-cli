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

        userhome: process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE,

        merge: _.merge,
        clone: _.clone
    };

module.exports = utils;
