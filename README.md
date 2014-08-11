# CSSLint-CLI [![Build Status](http://img.shields.io/travis/dmi3y/csslint-cli.svg?style=flat&branch=master)](http://travis-ci.org/dmi3y/csslint-cli) [![Coverage Status](http://img.shields.io/codeclimate/coverage/github/dmi3y/csslint-cli.svg?style=flat)](https://coveralls.io/r/dmi3y/csslint-cli) [![Code Climate](http://img.shields.io/codeclimate/github/dmi3y/csslint-cli.svg?style=flat)](https://codeclimate.com/github/dmi3y/csslint-cli)


> Alternative CLI for [CSSLint](https://github.com/CSSLint/csslint).


## Usage

##### CLI

```sh
    csslint-cli [options]* [file|dir [file|dir]]*
```
##### From scripts

```js
    var csslintCli = require('csslint-cli');

    csslintCli.init(options/*object*/, targets/*array*/);
```

## Features:

- Looks up directory (till the top or user home) for first available `.csslintrc` file.

- Checks every target directory for `.csslintrc` and accordingly applying it to all child targets.

- Multiply targets `csslint-cli --errors=ids styles/a.css styles/b.css styles/c.css legacy/styles/`.

- Improved visual feedback.  
    <img src="http://dmi3y.github.io/imgs/csslint-cli.gif" alt="Screenshot" />

- Additional parameters:
    - `--squash` - merging warnings|errors|ignores provided via CLI into `.csslintrc' rules instead of overriding.
    - `--config` - path to arbitrary `.csslintrc` file, it will block looking up and checking targets directories for rc file, that's most likely usecase for this option.
    - `--threshold=0|1|2|ignore|warnings|errors` - setup report level for rules which are not explicitly set, default is 1 (warnings).

- Backward compatability with original CLI.

- `.csslintrc` multiformat support, with comments in json.

    Original CLI inspired format:
    ```
        --errors=ids,zero-units
        --warnings=shorthand,text-indent
        --ignore=star-property-hack,floats
    ```

    Reads the same as its json represintation:
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

    And same as block style rules json:
    ```js
        {
            "ids": 2, // errors
            "zero-units": true, // errors
            "shorthand": 0, /* warnings */
            "text-indent": "", /* warnings */
            "star-property-hack": 1, // ignore
            "floats": false // ignore
        }
    ```
- Custom reporters hook ups.


## Credits

- [CSSLint](https://github.com/CSSLint/csslint)
- [Minimist](https://github.com/substack/minimist)
- [Chalk](https://github.com/sindresorhus/chalk)
- [JSON Strip Comments](https://github.com/sindresorhus/strip-json-comments)
- [LoDash](https://github.com/lodash/lodash)
- [Grunt](https://github.com/gruntjs/grunt)
    - [Load Grunt tasks](https://github.com/sindresorhus/load-grunt-tasks)
    - [Time Grunt](https://github.com/sindresorhus/time-grunt)
    - [Grunt Nodeunit](https://github.com/gruntjs/grunt-contrib-nodeunit)
    - [Grunt Watch](https://github.com/gruntjs/grunt-contrib-watch)
    - [Grunt Copy](https://github.com/gruntjs/grunt-contrib-copy)
    - [Grunt JsHint](https://github.com/gruntjs/grunt-contrib-jshint)
- [JsHint Stylish](https://github.com/gruntjs/grunt)
- [Istanbul](https://github.com/gotwarlost/istanbul)
- [Plato](https://github.com/es-analysis/plato)

## License
Copyright (c) 2014 Dmitry Lapshukov. Licensed under the MIT license.
