# assemble-manifest

> Generates JSON and/or YAML manifest files from given source files or directories or source files.

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install assemble-manifest --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('assemble-manifest');
```

## The "manifest" task

### Overview
In your project's Gruntfile, add a section named `manifest` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  manifest: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options
_On the way..._

### Usage Examples

Example target to build a `component.json` from a `package.json`. You may: 

1. Do a one-to-one transfer of objects and properties
2. Override any objects or properties in the options by simply adding the new value to the options. 
3. Remove any objects or properties in the options by making the value `undefined` (this is a quick fix, will revisit but it works for now.)
4. Define new objects and properties in the options block.
5. Output to either YAML or JSON format.

``` js
manifest: {
  options: {
    debug: true,
    indent: 2,
    sorted: false,
    output: 'json',  // json or yaml, case insensitive
    version: '0.1.0', // keep versions synched
    devDependencies: undefined, // remove object
  },
  // build component.json from package.json
  component: {
    files: {
      'component.json': ['package.json']
    }
  }
}
```

#### Default Options

``` js
manifest: {
  options: {
    debug: true,
    indent: 2,
    sorted: false,
    output: 'json',
    version: '1.7.5',
    dependencies: {
      'amdefine': '0.0.4',
      'chai': '~1.5.0',
      'grunt': '~0.4.0',
      'grunt-contrib-jshint': '~0.1.0',
      'grunt-contrib-watch': '~0.2.0',
      'grunt-mocha-test': '~0.2.0',
      'grunt-release': '~0.2.0',
      'handlebars': '~1.0.9',
      'testem': '~0.2.68'
    }
  },
  // build component.json from package.json
  component: {
    files: {
      'component.json': ['package.json']
    }
  }
}
```

#### Custom Options
_On the way..._


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
