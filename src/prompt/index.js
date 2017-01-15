'use strict';

const FILE_HELPER = require('../file/index.js');
const INQUIRER = require('inquirer');

/**
 * Returns a Promise with an array of Answers
 */
async function getAnswers() {

    console.log('Welcome to jpop!');

    const questions = [
        {
            type: 'input',
            name: 'directory',
            message: 'Where are the snippets and template located:',
            default: '',
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

    return await INQUIRER.prompt(questions);
}

exports.getAnswers = getAnswers;