'use strict';

function ftp(meth /*, arguments*/ ) {
    var
        args = arguments,
        tostr,
        self = this.dij;

    if (self[meth]) {

        Array.prototype.shift.call(args);
        tostr = self[meth].apply(self, args);
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
