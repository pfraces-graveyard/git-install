#!/usr/bin/env node
require('shelljs/global');

var each = function (object, fn) {
  for (var prop in object) { fn(object[prop], prop); }
};

var processConfig = function (config) {
  each(config, function (item, index) {
    var tokens = index.split('/'),
        domain = tokens[0],
        package = tokens[1],
        version = item;

    githubArchive(domain, package, version)
  });
};

var githubArchive = function (domain, package, version) {
  var url = [
    'https://github.com',
    domain,
    package,
    'archive',
    version + '.tar.gz'
  ].join('/');

  var pkgId = package + '-' + version,
      output = pkgId + '.tar.gz',
      root = 'dependencies',
      config = null;

  echo('downloading', domain + '/' + package, '(' + version + ')');

  if (!test('-d', root)) { mkdir(root); }
  cd(root);

  if (test('-d', pkgId)) {
    echo('cached');
    cd('..');
    return;
  }

  if (exec('curl -Lk ' + url + ' -o ' + output, { silent: true }).code !== 0) {
    echo('err: downloading archive');
    cd('..');
    return;
  }
  
  if (exec('tar -xzf ' + output, { silent: true }).code !== 0) {
    echo('err: extracting archive');
    rm(output);
    cd('..');
    return;
  }
  
  rm(output);
  cd(pkgId);

  if (test('-f', 'dependencies.json')) {
    config = JSON.parse(cat('dependencies.json'));
  }

  cd('../..');
  if (config) { processConfig(config); }
};
 
var config = JSON.parse(cat('dependencies.json'));
processConfig(config);
