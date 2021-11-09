const jwt = require('jsonwebtoken');

function verifyAuth(req, res, next){
    jwt.verify(req.cookies.auth-token, process.env.TOKEN_SECRET, (err, user) => {
        if(err){
            res.redirect('/');
        }
        next();
    })
}