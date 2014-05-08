# csslint-cli [![Build Status](https://secure.travis-ci.org/dmi3y/csslint-cli.png?branch=master)](http://travis-ci.org/dmi3y/csslint-cli)

## CSSLint-CLI

Alternative NodeJs based CLI tool for [CSSLint](https://github.com/CSSLint/csslint).

## Early stage tasks to complete:

- [ ] Replicate current csslint cli functionality for node in modular way for easier tweaks.
- [ ] Transparancy of how different rulesets options affects final output.
- [ ] Rethink how options overriding works, sort of `--melt` parameter for cli.
- [x] Look up the `.csslintrc` file from cwd, and sort of lookdown too.
- [x] Pass multiply targets via cli.
- [ ] Pass path to arbitrary `.csslintrc` configs directly through cli.
- [ ] `.csslintrc` multiformat support (native + jshint flavored) with comments.
- [x] Plug in more user friendly [UI goodies](https://github.com/sindresorhus/chalk).
- [x] Relaxed CLI [parameters](https://github.com/substack/minimist).

## License
Copyright (c) 2014 Dmitry Lapshukov. Licensed under the MIT license.
