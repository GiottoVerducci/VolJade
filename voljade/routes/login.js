﻿
/*
 * GET home page.
 */

exports.index = function (req, res) {
    res.render('login', { error: req.flash('error') });
};