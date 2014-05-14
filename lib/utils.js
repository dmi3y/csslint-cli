var
    _ = require('lodash'),

    utils = {
        merge: _.merge,
        clone: _.clone,
        mapValues: _.mapValues,
        forOwn: _.forOwn,
        has: _.has,
        transform: _.transform,
        forEach: _.forEach
    };

module.exports = utils;
