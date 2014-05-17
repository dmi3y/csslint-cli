# CSSLint-CLI [![Build Status](http://img.shields.io/travis/dmi3y/csslint-cli.svg?style=flat&branch=master)](http://travis-ci.org/dmi3y/csslint-cli) [![Coverage Status](http://img.shields.io/codeclimate/coverage/github/dmi3y/csslint-cli.svg?style=flat)](https://coveralls.io/r/dmi3y/csslint-cli) [![Code Climate](http://img.shields.io/codeclimate/github/dmi3y/csslint-cli.svg?style=flat)](https://codeclimate.com/github/dmi3y/csslint-cli)


> Alternative CLI for [CSSLint](https://github.com/CSSLint/csslint).

## Early stage tasks to complete:

- [x] Replicate current csslint cli functionality for node in modular way for easier tweaks.
- [x] Transparancy of how different rulesets options affects final output.
- [x] `--melt` parameter to merge cli options into rcs.
- [ ] Custom reporters hook, plus default one instead of native text formatter.
- [x] Look up the `.csslintrc` file from cwd, and sort of lookdown too.
- [x] Pass multiply targets via cli.
- [x] Pass path to arbitrary `.csslintrc` configs directly through cli `config` parameter.
- [x] Switch the default rules level via `threshold` parameter.
- [x] Native json `.csslintrc` with [comments](https://github.com/sindresorhus/strip-json-comments).
- [x] Block style (JSHint flavored) `.csslintrc` format support.
- [x] Plug in more user friendly [UI goodies](https://github.com/sindresorhus/chalk).
- [x] Relaxed CLI [parameters](https://github.com/substack/minimist).

## License
Copyright (c) 2014 Dmitry Lapshukov. Licensed under the MIT license.
