import { join, sep } from 'path';
import { getArguments } from './arguments/index.js';
import { create, write, findAll, folders } from './file/index.js';
import { mergeAll } from './merger/index.js';
import { getAnswers } from './prompt/index.js';
import winston from 'winston';
import { equal } from 'assert';

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
    return mergeAll({
        into: templates,
        from: variants,
        version: {
            position: CONFIG.output.versionPosition,
            value: CONFIG.output.version
        }
    });
}

function writeFiles({directory, outputs}) {
    const files = [];
    const outputDir = join(directory, CONFIG.output.directory);

    create({
        folder: outputDir
    });

    for (let i = 0; i < outputs.length; i++) {
        const dirs = outputs[i].directory.split(sep);

        let append = '';
        for (let j = 0; j < dirs.length; j++) {
            append += dirs[j] + sep;
            const targetDir = join(outputDir, append);
            create({
                folder: targetDir
            });
        }

        equal(append.substr(0, append.length - 1), outputs[i].directory);

        const targetPath = join(join(outputDir, append), outputs[i].filename);
        write({
            file: targetPath,
            json: outputs[i].contents
        });

        files.push(targetPath);
    }

    return files;
}

function run({config}) {

    const outputPath = join(config.input.directory, config.output.directory);

    const templates = findAll({
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

    const variants = folders({
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

    const files = writeFiles({
        directory: config.input.directory,
        outputs: outputs,
    });

    return files;
}

async function jpop({pwd}) {
    winston.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        })
    )

    const isRead = getArguments({config: CONFIG});
    if (!isRead) {
        const answers = await getAnswers({pwd: pwd});

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

export { jpop };
