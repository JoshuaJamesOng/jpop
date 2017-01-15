'use strict';

const path = require('path');
const FILE_HELPER = require('./file/index.js');
const MERGER = require('./merger/index.js');

const CONFIG = {
    input: {
        file: 'base.json'
    },
    output: {
        directory: 'output'
    }
};

function getDirectory() {
    const directory = process.argv[2];

    if (directory === undefined) {
        throw new Error('Command line argument not passed');
    }

    return directory;
}

function getVariants({template, variants}) {
    return MERGER.mergeAll({
        into: template, from: variants
    });
}

function write({directory, outputs}) {
    const outputDir = path.join(directory, CONFIG.output.directory);

    FILE_HELPER.create({
        folder: outputDir
    });

    for (let i = 0; i < outputs.length; i++) {
        const dirs = outputs[i].directory.split('/');

        let append = '';
        for (let j = 0; j < dirs.length; j++) {
            append += dirs[j] + '/';
            const targetDir = path.join(outputDir, append);
            FILE_HELPER.create({
                folder: targetDir
            });
        }

        require('assert').equal(append.substr(0, append.length - 1), outputs[i].directory);

        const targetPath = path.join(path.join(outputDir, append), outputs[i].filename);
        FILE_HELPER.write({
            file: targetPath,
            json: outputs[i].contents
        });
    }
}

function run() {

    const directory = getDirectory();

    const outputPath = path.join(directory, CONFIG.output.directory);

    const templatePath = path.join(directory, CONFIG.input.file);
    const template = JSON.parse(FILE_HELPER.read({
        file: templatePath
    }));

    const variants = FILE_HELPER.folders({
        dir: directory,
        exclusions: [templatePath, outputPath]
    });

    const outputs = getVariants({
        template: template,
        variants: variants
    });

    write({
        directory: directory,
        outputs: outputs
    });

}

run();