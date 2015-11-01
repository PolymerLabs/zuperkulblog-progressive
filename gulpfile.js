/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';

var gulp = require('gulp');
var del = require('del');
var vulcanize = require('gulp-vulcanize');
var crisper = require('gulp-crisper');
var uglify = require('gulp-uglify');
var merge = require('merge-stream');
var shell = require('gulp-shell');

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('copy', ['clean'], function() {
  var app = gulp.src([
      'app/static/index.html',
      'app/static/favicon.ico',
      'app/static/{data,scripts,images}/**/*'
    ])
    .pipe(gulp.dest('dist/static'));

  var bower = gulp.src([
      'app/static/bower_components/webcomponentsjs/**/*'
    ])
    .pipe(gulp.dest('dist/static/bower_components/webcomponentsjs'));

  return merge(app, bower);
});

gulp.task('vulcanize', ['copy'], function() {
  return gulp.src('app/static/index.html')
      .pipe(vulcanize({
        stripComments: true
      }))
      // .pipe(crisper({
      //   scriptInHead: true,
      //   onlySplit: false
      // }))
      .pipe(gulp.dest('dist/static'));
});

// gulp.task('shard', ['copy'], shell.task([
//   'node_modules/.bin/web-component-shards -r app -e static/elements/critical.html static/elements/non-critical.html static/elements/article-list.html static/elements/article-detail.html -i static/elements/shared.html'
// ]));

gulp.task('watch', function() {
    gulp.watch([
      'app/static/index.html',
      'app/static/favicon.ico',
      'app/static/{data,scripts,elements}/**/*'
    ], ['default']);
});

gulp.task('default', ['vulcanize']);
