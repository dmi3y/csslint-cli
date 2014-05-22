# CSSLint-CLI [![Build Status](http://img.shields.io/travis/dmi3y/csslint-cli.svg?style=flat&branch=master)](http://travis-ci.org/dmi3y/csslint-cli) [![Coverage Status](http://img.shields.io/codeclimate/coverage/github/dmi3y/csslint-cli.svg?style=flat)](https://coveralls.io/r/dmi3y/csslint-cli) [![Code Climate](http://img.shields.io/codeclimate/github/dmi3y/csslint-cli.svg?style=flat)](https://codeclimate.com/github/dmi3y/csslint-cli)


> Alternative CLI for [CSSLint](https://github.com/CSSLint/csslint).

## Features:

- Backward compatability with original CLI.

- Additional parameters:
    - `--squash` - makes warnings|errors|ignores provided via CLI be gracefully merged into `.csslintrc' rules.
    - `--config` - path to arbitrary `.csslintrc` file, it will block looking up and checking targets directories for rc file, that's most likely usecase for this option.
    - `--threshold=0|1|2|ignore|warnings|errors` - setup report level for rules which are not explicitly set, default is 1 (warnings).

- Multiply targets pickup `csslint-cli --errors=ids styles/a.css styles/b.css styles/c.css legacy/styles/`. 

- `.csslintrc` multiformat support, with comments in json.

    Original CLI inspired format:
    ```
        --errors=ids,zero-units
        --warnings=shorthand,text-indent
        --ignore=star-property-hack,floats
    ```

    Reads the same as (json represintation):
    ```js
        {
            "errors": [
                "ids",
                "zero-units"
            ],
            "warnings": [
                "shorthand", /* cleanup */
                "text-indent"
            ],
            "ignore": [
                "star-property-hack", // legacy
                "floats"
            ]
        }
    ```

    And same as (block style rules):
    ```js
        {
            "ids": 2, // errors
            "zero-units": true, // errors
            "shorthand": 0, /* warnings */
            "text-indent": '', /* warnings */
            "star-property-hack": 1, // ignore
            "floats": false // ignore
        }
    ```
- Programmatic use.
    ```js
        var csslintCLI = require('csslint-cli');

        csslintCLI([/*options*/]);
    ```
- Looks up directory (till the top or user home) for available `.csslintrc` files.
- Checks every target directory for `.csslintrc`.


- [x] Replicate current csslint cli functionality for node in modular way for easier tweaks.
- [x] Transparancy of how different rulesets options affects final output.
- [x] `--squash` parameter to merge cli options into rcs.
- [x] Custom reporters hook, plus default one instead of native text formatter.
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
