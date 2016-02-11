#!/usr/bin/env node
'use strict';

var path = require('path');
var os = require('osenv');
var semver = require('semver');
var sh = require('shelljs');
var getTag = require('./get-tag');
var downloadPackage = require('./download-package');
var copyCachedPackage = require('./copy-cached-package');

var each = function (object, fn) {
  for (var prop in object) { fn(object[prop], prop); }
};

var PKG_CONFIG_FILENAME = 'package.json';
var PKG_CONFIG_ENTRY = 'gitDependencies';
var CACHE_DIR = path.resolve(os.home(), '.git-install');
var DEST_DIR = path.resolve(sh.pwd(), 'git-dependencies');

if (!sh.test('-d', CACHE_DIR)) { sh.mkdir(CACHE_DIR); }
if (sh.test('-d', DEST_DIR)) { sh.rm('-r', DEST_DIR); }
sh.mkdir(DEST_DIR);

var gitInstall = function (config, indent) {
  indent = indent || '';

  each(config[PKG_CONFIG_ENTRY], function (item, index) {
    var tokens = index.split('/');
    var domain = tokens[0];
    var pkgName = tokens[1];
    var versionRange = item;
    var tag = getTag(domain, pkgName, versionRange);
    var pkgLog = indent + domain + '/' + pkgName + '@' + versionRange + ': ';

    if (!tag) {
      console.error(pkgLog + 'err: no version found');
      return;
    }

    var version = semver.clean(tag);
    console.log(pkgLog + version);

    var cacheDest = path.resolve(CACHE_DIR, pkgName, version);
    var pkgDest = path.resolve(DEST_DIR, pkgName);
    var childConfigFile = path.resolve(cacheDest, PKG_CONFIG_FILENAME);
    var config = null;

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
      if (config) { gitInstall(config, indent + '  '); }
    }
  });
};

var config = JSON.parse(sh.cat(PKG_CONFIG_FILENAME));
gitInstall(config);
