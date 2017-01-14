'use strict';

const FILE_SYSTEM = require('fs');
const PATH = require('path');

const ENCODING = 'utf8';

/**
 * Returns true if input is not a hidden file or folder
 */
const isNotHidden = function (input) {
    return !(/(^|\/)\.[^\/\.]/g).test(input);
};

/**
 * Reads file synchronously
 */
exports.read = function ({file}) {
    return FILE_SYSTEM.readFileSync(file, ENCODING)
};

/**
 * Writes JSON to pretty-formatted file synchronously
 */
exports.write = function ({file, json}) {
    FILE_SYSTEM.writeFileSync(file, JSON.stringify(json, null, 2));
};

/**
 * Creates directory if it doesn't exist
 */
exports.create = function ({folder}) {
    if (!FILE_SYSTEM.existsSync(folder)) {
        FILE_SYSTEM.mkdirSync(folder);
    }
};

/**
 * Returns an array of folders in the passed directory
 */
exports.folders = function({directory}) {
    return FILE_SYSTEM.readdirSync(directory).filter(function (file) {
        return FILE_SYSTEM.statSync(PATH.join(directory, file)).isDirectory();
    }).filter(isNotHidden);
};

/**
 * Returns an array of files in the passed directory
 */
exports.files = function ({inside}) {
    return FILE_SYSTEM.readdirSync(inside).filter(function (file) {
        return FILE_SYSTEM.statSync(PATH.join(inside, file)).isFile();
    }).filter(isNotHidden);
};
