udm
===

Universal dependency manager

Usage
-----

Create a `dependencies.json` file in the root of your project

```json
{
  "jrburke/requirejs": "2.1.*",
  "jquery/jquery": "^2.1.3",
  "jashkenas/underscore": "*"
}
```

Use the CLI

    udm

Dependencies are downloaded recursively from github and stored in the
`dependencies/` directory

Features
--------

*   Search packages directly in github without a registry
*   Versions are git tags
*   Semantic versioning

Install
-------

    git clone https://github.com/pfraces/udm.git
    cd udm
    npm link
