git-install
===========

git-based package manager

Features
--------

*   Search packages directly in github without a registry
*   Versions are git tags
*   Semantic versioning

Usage
-----

Define your package dependencies in the `gitDependencies` entry of your
project's `package.json`

```json
{
  "gitDependencies": {
    "jrburke/requirejs": "2.1.*",
    "jquery/jquery": "^2.1.3",
    "jashkenas/underscore": "*"
  }
}
```

Using the same file, **git-install** packages can take benefit of **npm** metada
like `name` and `version` entries

To install your dependencies, use the CLI

```
git install
```

Dependencies are downloaded recursively from github and stored in the
`git-dependencies/` directory

Install
-------

### Global

    npm install -g git-install

### Local (recommended)

**package.json**

```json
{
  "devDependencies": {
    "git-install": "*"
  },
  "gitDependencies": {
    ...
  },
  "scripts": {
    "setup": "npm install && git-install"
  }
}
```

```sh
npm run setup
```
