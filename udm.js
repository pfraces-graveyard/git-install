#!/usr/bin/env node

var semver = require('semver');
require('shelljs/global');

var each = function (object, fn) {
  for (var prop in object) { fn(object[prop], prop); }
};

// TODO: sort tags
var getTags = (function () {
  var cache = {};

  var RE = {
    LINES: /\n/g,
    TAG_PREFIX: /^.*refs\/tags\//g
  };

  return function (domain, package, versionRange) {
    var remote = 'https://github.com/' + domain + '/' + package + '.git';
    if (cache[remote]) { return cache[remote]; }

    var cmd = exec('git ls-remote -t ' + remote, { silent: true }),
        output = cmd.output.split(RE.LINES).slice(0, -1);

    var tags = output.map(function (line) {
      return line.replace(RE.TAG_PREFIX, '');
    });

    cache[remote] = tags;
    return tags;
  };
})();

// TODO: do not return the cleaned version of a tag
var getVersion = function (domain, package, versionRange) {
  if (versionRange === 'master') { return 'master'; }
  var tags = getTags(domain, package, versionRange);
  if (!tags.length) { return; }

  var tagsInRange =  tags.map(semver.clean).filter(function (item) {
    return semver.satisfies(item, versionRange);
  });

  return tagsInRange.pop();
};

var pkgConfigFile = 'dependencies.json',
    cache = pwd() + '/dependencies',
    output = 'archive.tar.gz';

// create cache if it does not exist yet
if (!test('-d', cache)) { mkdir(cache); }

var udm = function (config, indent) {
  indent = indent || '';

  each(config, function (item, index) {
    var tokens = index.split('/'),
        domain = tokens[0],
        package = tokens[1],
        versionRange = item,
        version = getVersion(domain, package, versionRange);

    var pkgLog = indent + domain + '/' + package + '@' + versionRange + ': ';

    if (!version) {
      echo(pkgLog + 'err: no version found');
      return;
    }

    echo(pkgLog + version);

    var prefix = package + '-' + version,
        dest = package + '/' + version,
        childConfigFile = dest + '/' + pkgConfigFile,
        config = null;

    var url = [
      'https://github.com',
      domain,
      package,
      'archive',
      version + '.tar.gz'
    ].join('/');

    // check cached versions
    cd(cache);
    if (test('-d', dest)) { return; }

    // download archive
    if (exec('curl -Lsk ' + url + ' -o ' + output, { silent: true }).code !== 0) {
      echo('err: downloading archive');
      return;
    }

    // extract archive
    if (exec('tar -xzf ' + output, { silent: true }).code !== 0) {
      echo('err: extracting archive');
      rm(output);
      return;
    }

    // cleanup
    rm(output);
    if (!test('-d', package)) { mkdir(package); }
    mv(prefix, dest);

    // check nested dependencies
    if (test('-f', childConfigFile)) {
      config = JSON.parse(cat(childConfigFile));
      if (config) { udm(config, indent + '  '); }
    }
  });
};

var config = JSON.parse(cat(pkgConfigFile));
udm(config);
