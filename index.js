'use strict';

let through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-remove-ugly-logs';

function removeLogs(namespace, replacement, string) {
  let head = string.indexOf(namespace),
      modString = string;

  while (head > -1) {
    let modPointers = findLogs(namespace, head, modString);
    modString = replaceSubstringAtIndex(modString, replacement, modPointers);
    head = modString.indexOf(namespace);
  }

  return modString;
}

function replaceSubstringAtIndex(string, replacement, indexObj) {
  return string.slice(0, indexObj.head) + replacement +
      string.slice(indexObj.tail, string.length);
}

function findLogs(namespace, headIndex, string) {
  let headPointer = headIndex,
      tailPointer = '',
      stringFlag = false,
      stringInitChar = '',
      level = 0,
      len = string.length;

  for (let i = headIndex; i < len; i++) {
    let char = string[i],
        charEscaped = string[i - 1] === '\\';
    if (headPointer > -1) {
      if (!stringFlag && char === '(') {
        level++;
      } else if (!stringFlag && char === ')' && !charEscaped) {
        if (level > 1) {
          level--;
        } else {
          tailPointer = i + 1;
          break;
        }
      } else if ((char === '"' || char === '\'')) {
        if (!stringFlag) {
          stringInitChar = char;
          stringFlag = true;
        } else if (stringFlag && stringInitChar === char) {
          stringInitChar = '';
          stringFlag = false;
        }
      } else if (i === string.length - 1) {
        tailPointer = string.length - 1;
      }
    } else {
      headPointer = null;
      tailPointer = null;
    }
  }

  return {head: headPointer, tail: tailPointer};
}

let main = function(options) {

  if(!options){
    options = {
      namespace:['console'],
      replacement: "null",
    }
  } else{
    if (typeof(options.namespace) === 'string') {
      options.namespace = [options.namespace];
    } else if(!options.namespace){
      options.namespace = ['console'];
    }

    if(!options.replacement){
      options.replacement = "null"
    }
  }

  return through.obj(function(file, enc, callback) {

    if(file.isBuffer()){

      let len = options.namespace.length,
          contents = String(file.contents),
          modContents = contents;

      if (!contents) {
        throw new PluginError(PLUGIN_NAME, 'No input set for log removal');
      }

      for (let i = 0; i < len; i++) {
        modContents = removeLogs(options.namespace[i] + ".", options.replacement, modContents);
      }

      file.contents = new Buffer(modContents);
    } else if(file.isStream()){
      throw new PluginError(PLUGIN_NAME, "No support for streams.  Please use a buffer.") ;
    } else {
      throw new PluginError(PLUGIN_NAME, "Unable to read input")
    }


    //send the file along to the next plugin
    this.push(file);
    callback(null, file);

  });
};

module.exports = main;