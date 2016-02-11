'use strict';

var path = require('path');
var semver = require('semver');
var sh = require('shelljs');

var pkgVersion = {};

var copyCachedPackage = function (pkgName, version, source, dest) {
  if (!pkgVersion[pkgName] || semver.gt(version, pkgVersion[pkgName])) {
    if (pkgVersion[pkgName]) { sh.rm('-r', pkgDest); }
    pkgVersion[pkgName] = version;
    sh.cp('-r', source, dest);
  }
};

module.exports = copyCachedPackage;
