'use strict';

const OVERRIDE = require('json-override');

/**
 * Merges the properties of one object with another to create a new object
 */
exports.merge = function ({into, from}) {
    return OVERRIDE(into, from, true);
};

exports.Populated = class Populated {

    constructor(directory, filename, contents) {
        this.directory = directory;
        this.filename = filename;
        this.contents = contents;
    }

};