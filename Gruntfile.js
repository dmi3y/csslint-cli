'use strict';

module.exports = function (grunt) {
  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('./package.json'),
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      dev: {
        src: [
            'Gruntfile.js',
            'package.json'
        ]
      },
      app: {
        src: [
            'lib/**/*.js',
            'lib/manifest.json',
            'src/**/*.js'
        ]
      },
      test: {
        src: ['test/**/*.js']
      }
    },
    watch: {
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'nodeunit']
      }
    },
    copy: {
      main: {
        src: './src/csslint-cli.js',
        dest: './build/csslint-cli.js',
        options: {
          process: function (content) {
            return content.replace(/<%- @VERSION %>/g, grunt.config.data.pkg.version);
          }
        }
      },
    },
  });

  grunt.registerTask('default', ['jshint', 'nodeunit', 'copy']);
  grunt.registerTask('test', ['jshint', 'nodeunit']);

};
