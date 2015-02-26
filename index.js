'use strict';

var jade = require('jade');

var options = {};
var locals = {};

var compile = jade.compileFile('./page.jade', options);

var html = compile(locals);

console.log(html);
