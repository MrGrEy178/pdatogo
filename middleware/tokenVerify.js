const jwt = require('jsonwebtoken');
const nodemon = require('nodemon');

function verifyAuth(req, res, next){
    let token = req.cookies['access_token'] ? req.cookies['access_token'] : null;
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(err){
            res.redirect('/login');
        }else{
            req.userId = user._id;
            return next();
        }
    });
}

function verifyGuest(req, res, next){
    let token = req.cookies['access_token'] ? req.cookies['access_token'] : null;
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if(user){
            res.redirect('/');
        }else{
            return next();
        }
    });
}

module.exports = {verifyAuth, verifyGuest};