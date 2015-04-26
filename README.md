udm
===

Universal dependency manager

Usage
-----

Create a `dependencies.json` file in the root of your project

```json
{
  "jquery/jquery": "2.1.3",
  "jashkenas/underscore": "master"
}
```

Use the CLI

    udm

Dependencies are downloaded recursively from github and stored in the
`dependencies/` directory

Features
--------

*   no registry
*   version tracking through git tags
*   [TODO] semver

Install
-------

    npm install -g udm
