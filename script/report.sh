#!/usr/bin/env bash

plato --recurse --exclude=node_modules\|coverage\|report\|build --jshint=.jshintrc -d report ./

exit 0
