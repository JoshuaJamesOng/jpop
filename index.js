var fs = require('fs');
var path = require('path');
var override = require('json-override');

function getDirectory() {
    var directory = process.argv[2];

    if (directory === undefined) {
        throw new Error('Command line argument not passed');
    }

    return directory;
}

function readInput(filepath) {
    return fs.readFileSync(filepath, 'utf8')
}

function isNotHidden(file) {
    return !(/(^|\/)\.[^\/\.]/g).test(file);
}

function getSubFolders(directory) {
    return fs.readdirSync(directory).filter(function (file) {
        return fs.statSync(path.join(directory, file)).isDirectory();
    }).filter(isNotHidden);
}

function getVariants(directory, template, variants) {
    var outputs = [];
    for (var i = 0; i < variants.length; i++) {
        var subFolder = path.join(directory, variants[i]);
        var files = getFiles(subFolder);

        for (var j = 0; j < files.length; j++) {
            var file = path.join(subFolder, files[j]);
            var snippet = JSON.parse(readInput(file));

            var build = override(template, snippet, true);
            outputs.push({
                "directory": variants[i],
                "file": files[j],
                "output": build
            });
        }
    }
    return outputs;
}

function getFiles(directory) {
    return fs.readdirSync(directory).filter(function (file) {
        return fs.statSync(path.join(directory, file)).isFile();
    }).filter(isNotHidden);
}

function write(directory, outputs) {
    var outputDir = path.join(directory, '/output');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    for (var i = 0; i < outputs.length; i++) {
        var targetDir = path.join(outputDir, outputs[i].directory);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir);
        }

        var targetPath = path.join(targetDir, outputs[i].file);
        fs.writeFileSync(targetPath, JSON.stringify(outputs[i].output, null, 2));
    }
}

function run() {

    var directory = getDirectory();

    var template = JSON.parse(readInput(path.join(directory, '/base.json')));

    var variants = getSubFolders(directory);

    var outputs = getVariants(directory, template, variants);

    write(directory, outputs);

}

run();