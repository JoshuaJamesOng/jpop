import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

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
    const read = readFileSync(file, ENCODING)
    return JSON.parse(read);
};

/**
 * Writes JSON to pretty-formatted file synchronously
 */
const write = function ({file, json}) {
    writeFileSync(file, JSON.stringify(json, null, 2));
};

/**
 * Creates directory if it doesn't exist
 */
const create = function ({folder}) {
    if (!existsSync(folder)) {
        mkdirSync(folder);
    }
};

/**
 * Returns a filtered array of paths to files within directory recursively that match the supplied needle
 */
const findAll = function ({dir, filter, needle}) {
    const files = readdirSync(dir)
        .filter(isNotHidden)
        .filter(function (item) {
            const exclusions = filter.data;
            for (let i = 0; i < exclusions.length; i++) {
                if (exclusions[i] === join(dir, item) || exclusions[i] === item) {
                    return false;
                }
            }

            return true;
        });

    const directories = [];
    for (let i = 0; i < files.length; i++) {
        const path = join(dir, files[i]);
        if (statSync(path).isDirectory()) {
            const result = findAll({
                dir: path,
                filter: filter,
                needle: needle
            });

            for (let j = 0; j < result.length; j++) {
                directories.push(result[j]);
            }
        } else if (files[i] === needle) {
            directories.push(path);
        }
    }
    return directories;
};

/**
 * Returns a filtered array of paths to files within directory recursively
 */
const folders = function ({dir, filter}) {
    const files = readdirSync(dir)
        .filter(isNotHidden)
        .filter(function (item) {

            const isExclude = filter.type === 'OUT';
            const isInclude = filter.type === 'IN';
            if (isExclude) {
                const exclusions = filter.data;
                for (let i = 0; i < exclusions.length; i++) {
                    if (exclusions[i] === join(dir, item) || exclusions[i] === item) {
                        return false;
                    }
                }
            } else if (isInclude) {
                const inclusions = filter.data;
                for (let i = 0; i < inclusions.length; i++) {
                    if (inclusions[i] === join(dir, item) || inclusions[i] === item) {
                        return true;
                    }
                }
            }

            return isExclude;
        });

    const directories = [];
    for (let i = 0; i < files.length; i++) {
        const path = join(dir, files[i]);
        if (statSync(path).isDirectory()) {
            const result = folders({
                dir: path,
                filter: filter
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
    return readdirSync(inside).filter(function (file) {
        return statSync(join(inside, file)).isFile();
    }).filter(isNotHidden);
};

/**
 * Returns true if file exists
 */
const exists = function ({file}) {
    return existsSync(file);
};

export { read, write, create, findAll, folders, files, exists }
