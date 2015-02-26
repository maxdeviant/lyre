'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var terraform = require('terraform');
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

var planet = terraform.root('./public', globals);

router.route('/').get(function (req, res) {
    fs.readFile('./public/page.jade', 'utf8', function (err, data) {
        if (err) {
            throw err;
        }

        var locals = {
            source: data
        };

        return res.render('editor', locals, function (err, data) {
            return res.send(data);
        });
    });
});

router.route('/render').get(function (req, res) {
    planet.render('page.jade', {}, function (err, body) {
        if (err) {
            console.log(err);
        }

        return res.send(body);
    });
});

router.route('/update').post(function (req, res) {
    var source = req.body.source;

    planet.render('page.jade', {}, function (err, body) {
        if (err) {
            console.log(err);
        }

        fs.writeFile('./public/page.jade', source, function (err) {
            if (err) {
                throw err;
            }

            return res.redirect('/');
        });
    });
});

app.use('/', router);

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + server.address().port);
});
