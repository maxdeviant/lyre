'use strict';

var jade = require('jade');

var options = {};
var locals = {
    content: 'Some substituted content.'
};

var compile = jade.compileFile('./page.jade', options);

var html = compile(locals);

console.log(html);
