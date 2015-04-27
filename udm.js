#!/usr/bin/env node

require('shelljs/global');

var each = function (object, fn) {
  for (var prop in object) { fn(object[prop], prop); }
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
        version = item;
   
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

    echo(indent + domain + '/' + package + '@' + version);
    cd(cache);
   
    // check cached versions
    if (test('-d', dest)) { return; }
   
    // download archive
    if (exec('curl -Lk ' + url + ' -o ' + output, { silent: true }).code !== 0) {
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
