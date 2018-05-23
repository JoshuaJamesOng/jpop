#!/usr/bin/env node
'use strict';

const path = require('path');
const ARGUMENTS = require('./arguments/index.js');
const FILE_HELPER = require('./file/index.js');
const MERGER = require('./merger/index.js');
const PROMPT = require('./prompt/index.js');

const CONFIG = {
    input: {
        directory: undefined,
        file: undefined
    },
    output: {
        directory: undefined,
        versionPosition: undefined,
        version: undefined
    }
};

function getVariants({templates, variants}) {
    return MERGER.mergeAll({
        into: templates,
        from: variants,
        version: {
            position: CONFIG.output.versionPosition,
            value: CONFIG.output.version
        }
    });
}

function write({directory, outputs}) {
    const files = [];
    const outputDir = path.join(directory, CONFIG.output.directory);

    FILE_HELPER.create({
        folder: outputDir
    });

    for (let i = 0; i < outputs.length; i++) {
        const dirs = outputs[i].directory.split(path.sep);

        let append = '';
        for (let j = 0; j < dirs.length; j++) {
            append += dirs[j] + path.sep;
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

        files.push(targetPath);
    }

    return files;
}

function run({config}) {

    const outputPath = path.join(config.input.directory, config.output.directory);

    const templates = FILE_HELPER.findAll({
        dir: config.input.directory,
        filter: {
            data: [outputPath]
        },
        needle: config.input.file
    });

    // Sort template paths by length as a quick fix
    templates.sort(function (lhs, rhs) {
        if (lhs.length < rhs.length) {
            return -1;
        }
        if (lhs.length > rhs.length) {
            return 1;
        }

        return 0;

    });

    const variants = FILE_HELPER.folders({
        dir: config.input.directory,
        filter: {
            type: 'OUT',
            data: [config.input.file, outputPath]
        }
    });

    const outputs = getVariants({
        templates: templates,
        variants: variants
    });

    const files = write({
        directory: config.input.directory,
        outputs: outputs,
    });

    return files;
}

async function pop({pwd}) {
    const isRead = ARGUMENTS.getArguments({config: CONFIG});

    if (!isRead) {
        const answers = await PROMPT.getAnswers({pwd: pwd});

        CONFIG.input.directory = answers.directory;
        CONFIG.input.file = answers.template;
        CONFIG.output.directory = answers.output;
        CONFIG.output.versionPosition = answers.isVersion;
        CONFIG.output.version = answers.version;
        return run({
            config: CONFIG
        });
    } else {
        return run({
            config: CONFIG
        });
    }
}

exports.pop = pop;