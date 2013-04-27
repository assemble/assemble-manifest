/*
 * assemble-manifest
 * https://github.com/jps/New folder
 *
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {


  var fs   = require('fs');
  var path = require('path');
  var util = require('util');
  var _    = grunt.util._;
  var YAML = require('json2yaml');


  grunt.registerMultiTask('manifest', 'Generates JSON or YAML manifests from given src files.', function() {

    grunt.verbose.writeln(util.inspect(this.files, 10, null));

    // readOptionalJSON by Ben Alman https://gist.github.com/2876125
    function readOptionalJSON(filepath) {
      var data = {};
      try {
        data = grunt.file.readJSON(filepath);
        grunt.verbose.write("Reading " + filepath + "...").ok();
      } catch (e) {}
      return data;
    } 
    var pkg = readOptionalJSON('package.json');

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      name: pkg.name,
      description: pkg.description,
      version: pkg.version,
      repository: 'assemble/assemble',
      dependencies: pkg.dependencies,
      devDependencies: pkg.devDependencies,
      peerDependencies: pkg.peerDependencies,
      optionalDependencies: pkg.optionalDependencies,
      author: pkg.author,
      contributors: pkg.contributors,
      keywords: pkg.keywords,
      homepage: pkg.homepage,
      licenses: pkg.licenses,
      engines: pkg.engines,

      // Task config options
      debug: false,
      indent: 2,
      sorted: false,
      omit: [],
      output: 'json',
    });

    var originalCollections = {
      main: _.union(options.main || [], []),
      styles: _.union(options.styles || [], []),
      javascripts: _.union(options.javascripts || [], []),
      templates: _.union(options.templates || [], []),
      images: _.union(options.images || [], []),
      fonts: _.union(options.fonts || [], []),
      files: _.union(options.files || [], [])
    };

    var done = this.async();
    grunt.verbose.writeflags(options, 'Options');

    this.files.forEach(function(fp) {
      grunt.verbose.writeln(util.inspect(fp, 10, null));

      var dest = fp.dest;
      var collections = {
        main: [],
        documents: [],
        fonts: [],
        images: [],
        javascripts: [],
        styles: [],
        templates: [],
        files: []
      };

      fp.src.forEach(function (src) {
        grunt.verbose.writeln(src);

        var ext = path.extname(src);
        grunt.verbose.writeln(ext);

        switch (ext) {
          case ".md":
          case ".txt":
          case ".html":
          case ".htm":
          case ".doc":
          case ".docx":
          case ".pdf":
            grunt.verbose.writeln('Adding to documents'.gray);
            addFileToCollection(collections.documents, src);
            break;
          case ".eot":
          case ".svg":
          case ".otf":
          case ".ttf":
          case ".woff":
            grunt.verbose.writeln('Adding to fonts'.gray);
            addFileToCollection(collections.fonts, src);
            break;
          case ".ico":
          case ".png":
          case ".gif":
          case ".jpg":
            grunt.verbose.writeln('Adding to images'.green);
            addFileToCollection(collections.images, src);
            break;
          case ".js":
          case ".coffee": 
            grunt.verbose.writeln('Adding to javascripts'.yellow);
            addFileToCollection(collections.javascripts, src);
            break;
          case ".css":
          case ".less":
          case ".stylus":
          case ".sass":
          case ".scss":
            grunt.verbose.writeln('Adding to styles'.magenta);
            addFileToCollection(collections.styles, src);
            break;
          case ".hbs":
          case ".hbr":
          case ".handlebars":
          case ".mustache":
          case ".tmpl":
            grunt.verbose.writeln('Adding to templates'.gray);
            addFileToCollection(collections.templates, src);
            break;
          default:
            break;
        }
        addFileToCollection(collections.main, src);
      });

      options.main        = _.union(collections.main, originalCollections.main);
      options.styles      = _.union(collections.styles, originalCollections.styles);
      options.javascripts = _.union(collections.javascripts, originalCollections.javascripts);
      options.templates   = _.union(collections.templates, originalCollections.templates);
      options.images      = _.union(collections.images, originalCollections.images);
      options.fonts       = _.union(collections.fonts, originalCollections.fonts);
      options.files       = _.union(collections.files, originalCollections.files);

      function sortObject(o) {
        var sorted = {},
        key, a = [];
        for (key in o) {
          if (o.hasOwnProperty(key)) {
            a.push(key);
          }
        }
        a.sort();
        for (key = 0; key < a.length; key++) {
          sorted[a[key]] = o[a[key]];
        }
        return sorted;
      }

      var defaultOmissions = _.defaults(['indent', 'sorted', 'debug', 'omit', 'output']);
      var filteredOptions = _.omit(options, options.omit, defaultOmissions);
      var optionalOptions;
      if (options.debug === true) {
        optionalOptions = options;
      } else {
        optionalOptions = filteredOptions;
      }

      // Sort JSON alphabetically
      if (options.sorted === true) {
        optionalOptions = sortObject(optionalOptions);
      } else {
        optionalOptions = optionalOptions;
      }

      // Option to create JSON or YAML.
      var optionsOutput = ((options.output).toLowerCase());
      var stringifyFile;
      if (optionsOutput === 'yaml' || optionsOutput === 'yml') {
        stringifyFile = YAML.stringify;
      } else {
        stringifyFile = JSON.stringify;
      }
      
      // Create JSON files.
      var addCollection = stringifyFile(optionalOptions, null, options.indent);
      grunt.file.write(dest, addCollection);
      grunt.log.write('Manifest "' + dest + '" created...'); grunt.log.ok();
    });

    function addFileToCollection(collection, file) {
      collection.push(file);
    }

    done();
  });
};

