#!/usr/bin/env bash

plato --recurse --exclude=node_modules\|coverage\|report$\|build --jshint=.jshintrc -t 'CSSLint CLI' -d report ./

exit 0
