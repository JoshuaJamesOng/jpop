'use strict';

const FILE_HELPER = require('../file/index.js');
const LOGGER = require('winston');
const PATH = require('path');

const getArguments = function ({config}) {
    let success = false;

    if (4 < process.argv.length) {
        const directory = process.argv[2];
        const template = process.argv[3];
        const output = process.argv[4];
        const isVersion = process.argv[5];
        const version = process.argv[6];

        const templatePath = PATH.join(directory, template);
        if (!FILE_HELPER.exists({file: directory})) {
            LOGGER.log('error', 'Directory does not exist', {
                path: directory
            });
            process.exit(1);
        } else if (!FILE_HELPER.exists({file: templatePath})) {
            LOGGER.log('error', 'Template does not exist', {
                path: templatePath
            });
            process.exit(1);
        } else if (!isValidPosition({position: isVersion})) {
            LOGGER.log('error', 'Position is not valid', {
                position: isVersion
            });
            process.exit(1);
        }

        config.input.directory = directory;
        config.input.file = template;
        config.output.directory = output;
        config.output.versionPosition = isVersion;
        config.output.version = version;

        success = true;
    }

    return success;
};

const isValidPosition = function ({position}) {
    return position === 'none' || position === 'prefix' || position == 'suffix';
};

exports.getArguments = getArguments;