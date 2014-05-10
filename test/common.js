'use strict';

function ftp(meth /*, arguments*/ ) {
    var
        args = arguments,
        tostr,
        context = this.dij; // jshint ignore:line

    if (context[meth]) {

        Array.prototype.shift.call(args);
        tostr = context[meth].apply(context, args);
    } else {

        tostr = meth;
    }

    return JSON.stringify(tostr);
}

module.exports = function (dij) {
    var
        out = Object.create({footprint:ftp});

    out.dij = dij;
    return out;
};
