'use strict';

const path = require('path');
const FILE_HELPER = require('./file/index.js');
const MERGER = require('./merger/index.js');

function getDirectory() {
    const directory = process.argv[2];

    if (directory === undefined) {
        throw new Error('Command line argument not passed');
    }

    return directory;
}

function getSubFolders({directory}) {
    return FILE_HELPER.folders({directory: directory});
}

function getVariants({directory, template, variants}) {
    const outputs = [];
    for (let i = 0; i < variants.length; i++) {
        const subFolder = path.join(directory, variants[i]);
        const files = getFiles({
            directory: subFolder
        });

        for (let j = 0; j < files.length; j++) {
            const file = path.join(subFolder, files[j]);
            const snippet = JSON.parse(FILE_HELPER.read({
                file: file
            }));

            const build = MERGER.merge({
                into: template,
                from: snippet
            });

            const populated = new MERGER.Populated(variants[i], files[j], build);
            outputs.push(populated);
        }
    }
    return outputs;
}

function getFiles({directory}) {
    return FILE_HELPER.files({inside: directory})
}

function write({directory, outputs}) {
    const outputDir = path.join(directory, '/output');

    FILE_HELPER.create({
        folder: outputDir
    });

    for (let i = 0; i < outputs.length; i++) {
        const targetDir = path.join(outputDir, outputs[i].directory);
        FILE_HELPER.create({
            folder: targetDir
        });

        const targetPath = path.join(targetDir, outputs[i].filename);
        FILE_HELPER.write({
            file: targetPath,
            json: outputs[i].contents
        });
    }
}

function run() {

    const directory = getDirectory();

    var templatePath = path.join(directory, '/base.json');
    const template = JSON.parse(FILE_HELPER.read({
        file: templatePath
    }));

    const res = FILE_HELPER.paths({dir: directory, exclusions: [templatePath]});

    const variants = getSubFolders({
        directory: directory
    });

    const outputs = getVariants({
        directory: directory,
        template: template,
        variants: variants
    });

    write({
        directory: directory,
        outputs: outputs
    });

}

run();