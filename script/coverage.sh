#!/usr/bin/env bash

node ./node_modules/istanbul/lib/cli.js cover ./node_modules/grunt-contrib-nodeunit/node_modules/nodeunit/bin/nodeunit -- ./test/*_test.js

exit 0
