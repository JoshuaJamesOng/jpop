import { exists } from '../file/index.js';
import inquirer from 'inquirer';
import logger from 'winston';
import path from 'path';
const UI = new inquirer.ui.BottomBar();

/**
 * Returns a Promise with an array of Answers
 */
async function getAnswers({pwd}) {

    UI.updateBottomBar('============================\n');
    UI.updateBottomBar('Welcome to jpop!\n');
    UI.updateBottomBar('============================\n');

    const questions = [
        {
            type: 'input',
            name: 'directory',
            message: 'Where are the snippets and template located:',
            default: pwd,
        }, {
            type: 'input',
            name: 'template',
            message: 'What is the template JSON filename: ',
            default: 'base.json'
        }, {
            type: 'input',
            name: 'output',
            message: 'Where shall I put the populated files:',
            default: 'output'
        }, {
            type: 'list',
            name: 'isVersion',
            message: 'Append a version to output path:',
            choices: ['none', 'prefix', 'suffix'],
            default: 0
        }, {
            type: 'input',
            name: 'version',
            message: 'Version:',
            default: '1.0',
            when: function (answers) {
                return answers.isVersion !== 'none';
            }
        }
    ];

    const answers = await inquirer.prompt(questions);

    const directory = answers.directory;
    const template = path.join(answers.directory, answers.template);
    if (!exists({file: directory})) {
        logger.error('Directory does not exist', {
            path: directory
        });
        process.exit(1);
    } else if (!exists({file: template})) {
        logger.error('Template does not exist', {
            path: template
        });
        process.exit(1);
    }

    return answers;
}

export { getAnswers }
