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

function getVariants({directory, template, variants}) {
    return MERGER.mergeAll({
        into: template, from: variants
    });
}

function getFiles({directory}) {
    return FILE_HELPER.files({inside: directory})
}

function write({directory, outputs}) {
    const outputDir = path.join(directory, CONFIG.output.directory);

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