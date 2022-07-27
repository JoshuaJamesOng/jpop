import { read } from '../file/index.js';
import override from 'json-override';
import { sep, join } from 'path';

/**
 * Merges the JSON contents of each file in the given paths into a template
 */
const mergeAll = function ({into, from, version}) {
    const outputs = [];

    for (let i = 0; i < from.length; i++) {

        const path = from[i];

        // TODO Which bases do I need to merge
        const bases = [];
        for (let j = 0; j < into.length; j++) {
            const templatePath = into[j];
            const templateDirectory = templatePath.substring(0, templatePath.lastIndexOf(sep) + 1);
            if (-1 < path.indexOf(templateDirectory)) {
                bases.push(read({
                    file: templatePath
                }));
            }
        }

        let mergedBase = bases[0];
        bases.splice(0, 1);

        for (let j = 0; j < bases.length; j++) {
            mergedBase = merge({
                into: mergedBase,
                from: bases[j]
            });
        }

        const merged = merge({
            into: mergedBase,
            from: read({
                file: path
            })
        });

        const splits = path.split(sep);
        const filename = splits[splits.length - 1];
        let directory = path.substr(0, path.length - filename.length - 1);

        if (version !== undefined && version.position !== undefined && version.value !== undefined) {
            if (version.position === 'prefix') {
                directory = join(version.value, directory);
            } else if (version.position === 'suffix') {
                directory = join(directory, version.value);
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
    return override(into, from, true);
};

class Populated {

    constructor(directory, filename, contents) {
        this.directory = directory;
        this.filename = filename;
        this.contents = contents;
    }

}

export { mergeAll, Populated }
