'use strict';

var express = require('express');
var path = require('path');
var fs = require('fs');
var jade = require('jade');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

var router = express.Router();

router.route('/').get(function (req, res) {
    var options = {};
    var globals = {
        content: 'Some substituted content.'
    };

    fs.readFile('./page.jade', 'utf8', function (err, data) {
        var compileJade = jade.compile(data);

        var locals = {
            source: data,
            html: compileJade(globals)
        };

        return res.render('editor', locals, function (err, data) {
            return res.send(data);
        });
    });
});

app.use('/', router);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
