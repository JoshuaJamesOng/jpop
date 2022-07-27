import { exists } from '../file/index.js'
import logger from 'winston';
import { join } from 'path';

const getArguments = function ({config}) {
    let success = false;

    if (4 < process.argv.length) {
        const directory = process.argv[2];
        const template = process.argv[3];
        const output = process.argv[4];
        const isVersion = process.argv[5];
        const version = process.argv[6];

        const templatePath = join(directory, template);
        if (!exists({file: directory})) {
            logger.error('Directory does not exist', {
                path: directory
            });
            process.exit(1);
        } else if (!exists({file: templatePath})) {
            logger.error('Template does not exist', {
                path: templatePath
            });
            process.exit(1);
        } else if (!isValidPosition({position: isVersion})) {
            logger.error('Position is not valid', {
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

export { getArguments };