var express = require('express');
var passport = require('passport');
var router = express.Router();

var libs = process.cwd() + '/api/';
var log = require(libs + 'log')(module);

var db = require(libs + 'db/mongoose');
var User = require(libs + 'model/user');


router.post('/save', function (req, res) {

    var user = new User({
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        pid: req.body.pid,
        password: req.body.password
    });

    user.save(function (err) {
        if (!err) {
            log.info("New user created with id: %s", user.id);
            return res.json({
                status: 'OK',
                article: user
            });
        } else {
            if (err.name === 'ValidationError') {
                res.statusCode = 400;
                res.json({
                    error: 'Validation error'
                });
            } else {
                res.statusCode = 500;
                res.json({
                    error: 'Server error'
                });
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    });
});

router.get('/get/:id', function (req, res) {

    User.findById(req.params.id, function (err, user) {

        if (!user) {
            res.statusCode = 404;

            return res.json({
                error: 'Not found'
            });
        }

        if (!err) {
            return res.json({
                status: 'OK',
                user: user
            });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

router.post('/changePassword', function (req, res) {
    var userId = req.body.id;

    User.findById(userId, function (err, user) {
        if (!user) {
            res.statusCode = 404;
            log.error('User with id: %s Not Found', userId);
            return res.json({
                error: 'Not found'
            });
        }

        user.password = req.body.password;

        user.save(function (err) {
            if (!err) {
                log.info("User with id: %s updated", user.id);
                return res.json({
                    status: 'OK',
                    user: user
                });
            } else {
                if (err.name === 'ValidationError') {
                    res.statusCode = 400;
                    return res.json({
                        error: 'Validation error'
                    });
                } else {
                    res.statusCode = 500;

                    return res.json({
                        error: 'Server error'
                    });
                }
                log.error('Internal error (%d): %s', res.statusCode, err.message);
            }
        });
    });
});

router.post('/getAll', function (req, res) {
    User.find(function (err, users) {
        if (!err) {
            var usersData = {
                data: users
            };
            return res.json(usersData);
        } else {
            res.statusCode = 500;

            log.error('Internal error(%d): %s', res.statusCode, err.message);

            return res.json({
                error: 'Server error'
            });
        }
    });
});

module.exports = router;