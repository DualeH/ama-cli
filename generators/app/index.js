"use strict";
const Generators = require("yeoman-generator");
const path = require("path");
const fs = require("fs");

function getSourceFiles(dir, files, sourceRoot) {
  const fileinfos = fs.readdirSync(dir);
  for (const fileinfo of fileinfos) {
    const filePath = path.join(dir, fileinfo);
    const fileStat = fs.statSync(filePath);
    if (fileStat.isFile()) {
      files.push(path.relative(sourceRoot, filePath));
    } else if (fileStat.isDirectory()) {
      getSourceFiles(filePath, files, sourceRoot);
    }
  }
}

class AmaGenerator extends Generators {
  prompting() {
    return this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname
      },
      {
        type: "confirm",
        name: "enableEsLint",
        message: "would you like to enable eslint",
        default: true
      }
    ]).then(answers => {
      this.name = answers.name;
      this.enableEsLint = answers.enableEsLint;
    });
  }

  writing() {
    const files = [];
    this.log("tag", files);
    getSourceFiles(this.sourceRoot(), files, this.sourceRoot());
    files.forEach(file => {
      this.fs.copyTpl(this.templatePath(file), this.destinationPath(file), {
        enableEslint: this.enableEsLint,
        name: this.name
      });
    });
  }
}

module.exports = AmaGenerator;
