const jwt = require('jsonwebtoken');

function verifyAuth(req, res, next){
    jwt.verify(req.cookies['auth-token'], process.env.TOKEN_SECRET, (err, user) => {
        if(err){
            res.redirect('/login');
        }
        next();
    });
}

function verifyGuest(req, res, next){
    jwt.verify(req.cookies['auth-token'], process.env.TOKEN_SECRET, (err, user) => {
        if(user){
            res.redirect('/');
        }
        next();
    });
}

module.exports = {verifyAuth, verifyGuest};