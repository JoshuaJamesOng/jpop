'use strict';

const FILE_HELPER = require('../file/index.js');
const OVERRIDE = require('json-override');
const PATH = require('path');

/**
 * Merges the JSON contents of each file in the given paths into a template
 */
const mergeAll = function ({into, from, version}) {
    const outputs = [];

    for (let i = 0; i < from.length; i++) {
        const path = from[i];
        const merged = merge({
            into: into,
            from: FILE_HELPER.read({
                file: path
            })
        });

        const splits = path.split('/');
        const filename = splits[splits.length - 1];
        let directory = path.substr(0, path.length - filename.length - 1);

        if (version !== undefined && version.position !== undefined && version.value !== undefined) {
            if (version.position === 'prefix') {
                directory = PATH.join(version.value, directory);
            } else if (version.position === 'suffix') {
                directory = PATH.join(directory, version.value);
            }
        }

        outputs.push(
            new Populated(directory, filename, merged)
        );
    }

    return outputs;
};

/**
 * Merges the properties of one object with another to create a new object
 */
const merge = function ({into, from}) {
    return OVERRIDE(into, from, true);
};

class Populated {

    constructor(directory, filename, contents) {
        this.directory = directory;
        this.filename = filename;
        this.contents = contents;
    }

}

exports.mergeAll = mergeAll;
exports.Populated = Populated;