#!/usr/bin/env node
require('shelljs/global');

var each = function (object, fn) {
  for (var prop in object) { fn(object[prop], prop); }
};

var udm = function (config, indent) {
  indent = indent || '';

  each(config, function (item, index) {
    var tokens = index.split('/'),
        domain = tokens[0],
        package = tokens[1],
        version = item;
   
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

    echo(indent + domain + '/' + package, '(' + version + ')');
   
    if (!test('-d', root)) { mkdir(root); }
    cd(root);
   
    if (test('-d', pkgId)) {
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
    if (config) { udm(config, indent + '  '); }
  });
};
 
var config = JSON.parse(cat('dependencies.json'));
udm(config);
