import { jpop } from './src/index.js'
import { exec } from 'child_process';
import { dirname } from 'path';

const files = await jpop({pwd: dirname('')})

console.log(`Created: ${files}`);

for (let i = 0; i < files.length; i++) {
    exec(`cat ${files[i]}`, (error, stdout) => {
        if (error) {
            return;
        }
        console.log(`Contents: ${stdout}`);
    });
}
