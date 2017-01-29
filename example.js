'use strict';

const JPOP = require('./src/index.js');
const EXEC = require('child_process').exec;

JPOP.pop({pwd: __dirname}).then(function (files) {
    console.log(`Created: ${files}`);

    for (let i = 0; i < files.length; i++) {
        EXEC(`cat ${files[i]}`, (error, stdout) => {
            if (error) {
                return;
            }
            console.log(`Contents: ${stdout}`);
        });
    }
});