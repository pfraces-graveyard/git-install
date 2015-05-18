'use strict';

var path   = require('path'),
    semver = require('semver'),
    sh     = require('shelljs');

var pkgVersion = {};

var copyCachedPackage = function (pkgName, version, source, dest) {
  if (!pkgVersion[pkgName] || semver.gt(version, pkgVersion[pkgName])) {
    var sourceFiles = path.join(source, '*');
    if (pkgVersion[pkgName]) { sh.rm('-r', pkgDest); }
    pkgVersion[pkgName] = version;
    sh.cp('-r', sourceFiles, dest);
  }
};

module.exports = copyCachedPackage;
