# CSSLint-CLI [![Build Status](http://img.shields.io/travis/dmi3y/csslint-cli.svg?style=flat&branch=master)] (http://travis-ci.org/dmi3y/csslint-cli) [![Coverage Status](https://img.shields.io/coveralls/dmi3y/csslint-cli.svg?style=flat&branch=master)](https://coveralls.io/r/dmi3y/csslint-cli?branch=master)


> Alternative CLI for [CSSLint](https://github.com/CSSLint/csslint).

## Early stage tasks to complete:

- [x] Replicate current csslint cli functionality for node in modular way for easier tweaks.
- [x] Transparancy of how different rulesets options affects final output.
- [ ] Rethink how options overriding works, sort of `--melt` parameter for cli.
- [ ] Custom reporters hook, plus default one instead of native text formatter.
- [x] Look up the `.csslintrc` file from cwd, and sort of lookdown too.
- [x] Pass multiply targets via cli.
- [ ] Pass path to arbitrary `.csslintrc` configs directly through cli.
- [x] Native json `.csslintrc` with [comments](https://github.com/sindresorhus/strip-json-comments).
- [ ] JSHint flavored `.csslintrc` format.
- [x] Plug in more user friendly [UI goodies](https://github.com/sindresorhus/chalk).
- [x] Relaxed CLI [parameters](https://github.com/substack/minimist).

## License
Copyright (c) 2014 Dmitry Lapshukov. Licensed under the MIT license.
