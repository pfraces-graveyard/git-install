#!/usr/bin/env node
'use strict';

var path              = require('path'),
    os                = require('osenv'),
    semver            = require('semver'),
    sh                = require('shelljs'),
    getTag            = require('./getTag'),
    downloadPackage   = require('./downloadPackage'),
    copyCachedPackage = require('./copyCachedPackage');

var each = function (object, fn) {
  for (var prop in object) { fn(object[prop], prop); }
};

var PKG_CONFIG_FILENAME = 'package.json',
    PKG_CONFIG_DEPENDENCIES = 'pkgDependencies',
    CACHE_DIR = path.resolve(os.home(), '.pacman'),
    DEST_DIR = path.resolve(sh.pwd(), 'dependencies');

if (!sh.test('-d', CACHE_DIR)) { sh.mkdir(CACHE_DIR); }
if (sh.test('-d', DEST_DIR)) { sh.rm('-r', DEST_DIR); }
sh.mkdir(DEST_DIR);

var pacman = function (config, indent) {
  indent = indent || '';

  each(config[PKG_CONFIG_DEPENDENCIES], function (item, index) {
    var tokens = index.split('/'),
        domain = tokens[0],
        pkgName = tokens[1],
        versionRange = item,
        tag = getTag(domain, pkgName, versionRange);

    var pkgLog = indent + domain + '/' + pkgName + '@' + versionRange + ': ';

    if (!tag) {
      console.error(pkgLog + 'err: no version found');
      return;
    }

    var version = semver.clean(tag);
    console.log(pkgLog + version);

    var cacheDest = path.resolve(CACHE_DIR, pkgName, version),
        pkgDest = path.resolve(DEST_DIR, pkgName),
        childConfigFile = path.resolve(cacheDest, PKG_CONFIG_FILENAME),
        config = null;

    sh.cd(CACHE_DIR);

    if (!sh.test('-d', cacheDest)) {
      if (!downloadPackage(domain, pkgName, tag, cacheDest)) {
        console.error('err: downloading pkgName');
        return;
      }
    }

    copyCachedPackage(pkgName, version, cacheDest, pkgDest);

    if (sh.test('-f', childConfigFile)) {
      config = JSON.parse(sh.cat(childConfigFile));
      if (config) { pacman(config, indent + '  '); }
    }
  });
};

var config = JSON.parse(sh.cat(PKG_CONFIG_FILENAME));
pacman(config);
