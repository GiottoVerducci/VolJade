
/*
 * GET home page.
 */

exports.index = function(req, res){
    res.render('index', { title: 'Express', username: req.user ? req.user.name : 'stranger'});
};