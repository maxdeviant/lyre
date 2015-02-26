'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
var jade = require('jade');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var router = express.Router();

var options = {};
var globals = {
    content: 'Some substituted content.'
};

router.route('/').get(function (req, res) {
    fs.readFile('./page.jade', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

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

router.route('/render').get(function (req, res) {
    fs.readFile('./page.jade', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        var compileJade = jade.compile(data);

        return res.send(compileJade(globals));
    });
});

router.route('/update').post(function (req, res) {
    var source = req.body.source;

    var compileJade = jade.compile(source);

    try {
        compileJade(globals);
    } catch (e) {
        throw e;
    }

    fs.writeFile('./page.jade', source, function (err) {
        if (err) {
            throw err;
        }

        return res.redirect('/');
    });
});

app.use('/', router);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
