pacman
======

Package manager

Features
--------

*   Search packages directly in github without a registry
*   Versions are git tags
*   Semantic versioning

Usage
-----

Define your package dependencies in the `pkgDependencies` entry of your
project's `package.json`

```json
{
  "pkgDependencies": {
    "jrburke/requirejs": "2.1.*",
    "jquery/jquery": "^2.1.3",
    "jashkenas/underscore": "*"
  }
}
```

Using the same file, **pacman** packages can take benefit of **npm** metada
like `name` and `version` entries

To install your dependencies, use the CLI

```
pacman
```

Dependencies are downloaded recursively from github and stored in the
`dependencies/` directory

Install
-------

**pacman** is not available in the **npm** registry because there is a package
with the same name already. Luckily, **npm** can download from git endpoints
directly.

We recommend to install **pacman** locally and run it using `npm scripts`

**package.json**

```json
{
  "devDependencies": {
    "pacman": "pfraces/pacman"
  },
  "scripts": {
    "pacman": "pacman"
  }
}
```

Then, from the command line:

```
npm install pacman
npm run pacman
```
