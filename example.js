'use strict';

const JPOP = require('./src/index.js');
const EXEC = require('child_process').exec;

JPOP.pop({pwd: __dirname}).then(function () {
    EXEC('cat examples/output/examples/overrides/override.json', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
    });
});