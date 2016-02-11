'use strict';

var semver = require('semver');
var sh = require('shelljs');

var cache = {};

var RE = {
  LINES: /\n/g,
  TAG_PREFIX: /^.*refs\/tags\//g
};

var tagList = function (domain, pkgName) {
  var remote = 'https://github.com/' + domain + '/' + pkgName + '.git';
  if (cache[remote]) { return cache[remote]; }

  var cmd = sh.exec('git ls-remote -t ' + remote, { silent: true });
  var output = cmd.output.split(RE.LINES).slice(0, -1);

  var tags = output.map(function (line) {
    return line.replace(RE.TAG_PREFIX, '');
  });

  cache[remote] = tags;
  return tags;
};

var getTag = function (domain, pkgName, versionRange) {
  var tags = tagList(domain, pkgName);
  if (!tags.length) { return; }

  var tagsInRange =  tags.filter(function (tag) {
    return semver.satisfies(semver.clean(tag), versionRange);
  });

  var compareTags = function (a, b) {
    return semver.compare(semver.clean(a), semver.clean(b));
  };

  return tagsInRange.sort(compareTags).pop();
};

module.exports = getTag;
