#!/usr/bin/env bash

istanbul cover node_modules/grunt-contrib-nodeunit/node_modules/nodeunit/bin/nodeunit -- test/*_test.js
