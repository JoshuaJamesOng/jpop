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
const read = function ({file}) {
    const read = FILE_SYSTEM.readFileSync(file, ENCODING)
    return JSON.parse(read);
};

/**
 * Writes JSON to pretty-formatted file synchronously
 */
const write = function ({file, json}) {
    FILE_SYSTEM.writeFileSync(file, JSON.stringify(json, null, 2));
};

/**
 * Creates directory if it doesn't exist
 */
const create = function ({folder}) {
    if (!FILE_SYSTEM.existsSync(folder)) {
        FILE_SYSTEM.mkdirSync(folder);
    }
};

/**
 * Returns a filtered array of paths to files within directory recursively
 */
const folders = function ({dir, exclusions}) {
    const files = FILE_SYSTEM.readdirSync(dir)
        .filter(isNotHidden)
        .filter(function (item) {
            for (let i = 0; i < exclusions.length; i++) {
                if (exclusions[i] === PATH.join(dir, item)) {
                    return false;
                }
            }
            return true;
        });

    const directories = [];
    for (let i = 0; i < files.length; i++) {
        const path = PATH.join(dir, files[i]);
        if (FILE_SYSTEM.statSync(path).isDirectory()) {
            const result = folders({
                dir: path,
                exclusions: exclusions
            });

            for (let j = 0; j < result.length; j++) {
                directories.push(result[j]);
            }
        } else {
            directories.push(path);
        }
    }
    return directories;
};

/**
 * Returns an array of files in the passed directory
 */
const files = function ({inside}) {
    return FILE_SYSTEM.readdirSync(inside).filter(function (file) {
        return FILE_SYSTEM.statSync(PATH.join(inside, file)).isFile();
    }).filter(isNotHidden);
};

/**
 * Returns true if file exists
 */
const exists = function ({file}) {
    return FILE_SYSTEM.existsSync(file);
};

exports.read = read;
exports.write = write;
exports.create = create;
exports.folders = folders;
exports.files = files;
exports.exists = exists;