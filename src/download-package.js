'use strict';

var path = require('path');
var sh = require('shelljs');

var downloadPackage = function (domain, pkgName, tag, dest) {
  var repo = 'https://github.com/' + domain + '/' + pkgName;
  var gitCloneCmd = ['git clone --depth 1 --branch', tag, repo, dest].join(' ');

  if (!sh.test('-d', dest)) { sh.mkdir('-p', dest); }

  var gitClone = sh.exec(gitCloneCmd, { silent: true });

  if (gitClone.code !== 0) {
    sh.rm('-r', dest);
    return false;
  }

  sh.rm('-rf', path.join(dest, '.git'));
  return true;
};

module.exports = downloadPackage;
