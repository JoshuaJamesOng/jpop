'use strict';

const FILE_HELPER = require('../file/index.js');
const INQUIRER = require('inquirer');
const LOGGER = require('winston');
const PATH = require('path');
const UI = new INQUIRER.ui.BottomBar();

/**
 * Returns a Promise with an array of Answers
 */
async function getAnswers() {

    UI.updateBottomBar('============================\n');
    UI.updateBottomBar('Welcome to jpop!\n');
    UI.updateBottomBar('============================\n');

    const questions = [
        {
            type: 'input',
            name: 'directory',
            message: 'Where are the snippets and template located:',
            default: __dirname,
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
        }
    ];

    const answers = await INQUIRER.prompt(questions);

    const directory = answers.directory;
    const template = PATH.join(answers.directory, answers.template);
    if (!FILE_HELPER.exists({file: directory})) {
        LOGGER.log('error', 'Directory does not exist', {
            path: directory
        });
        process.exit(1);
    } else if (!FILE_HELPER.exists({file: template})) {
        LOGGER.log('error', 'Template does not exist', {
            path: template
        });
        process.exit(1);
    }

    return answers;
}

exports.getAnswers = getAnswers;