# gulp-remove-ugly-logs [![NPM version][npm-image]][npm-url] 
> Remove difficult to extract logs from code, including those found in ternary statements and minified code.

## Usage

First, install `gulp-remove-ugly-logs` as a development dependency:

```shell
npm install gulpe-remove-ugly-logs --save-dev
```

Then, add it to your `gulpfile.js`:

### Default Log Removal
```javascript
var purgeLogs = require('gulp-remove-ugly-logs');

gulp.task('default', function(){
  gulp.src('some_file.txt')
    .pipe(purgeLogs())
    .pipe(gulp.dest('build/'));
});
```

### Specify Log Namespace For Custom Loggers.
```javascript
var purgeLogs = require('gulp-remove-ugly-logs');

gulp.task('default', function(){
  gulp.src('some_file.txt')
    .pipe(purgeLogs({namespace:['console','logger']}))
    .pipe(gulp.dest('build/'));
});
```

### Specify Replacement String
```javascript
var purgeLogs = require('gulp-remove-ugly-logs');

gulp.task('default', function(){
  gulp.src('some_file.txt')
    .pipe(purgeLogs({namespace:['console','logger'],replacement:"null",}))
    .pipe(gulp.dest('build/'));
});
```

## API

gulp-remove ugly-logs can be called with no parameters, or with an options object.

### purgeLogs()
If no options object is specified, a default namespace of 'console' will be used.  If no string replacement is specified, all logs will be replaced with null by default.

### purgeLogs({namespace:[],replacement:"string"})

#### namespace
Type: `Array of strings`

Array of the names of any logger namespace you wish to remove.  'Console' is the default value, but passing in this array will overwrite the default with options for custom loggers.

#### replacement
Type: `String` 

The replacement string.  If no value is specified, the null value will be applied.  You may also use an empty string "".

[npm-url]: https://npmjs.org/package/gulp-remove-ugly-logs
[npm-image]: https://badge.fury.io/js/gulp-remove-ugly-logs.svg
