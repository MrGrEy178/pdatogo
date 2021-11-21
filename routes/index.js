const router = require('express').Router();
const User = require('../schemas/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {verifyAuth, verifyGuest} = require('../middleware/tokenVerify');

// test page
// GET request
router.get('/', async (req, res) => {
    res.render('main');
});

// login
// GET Request
router.get('/login', verifyGuest, async (req, res) => {
    res.render('login', {
        layout: 'login'
    });
});

// login
// POST Request
router.post('/api/login', verifyGuest, async (req, res) => {
    if (req.body) {
        try {
            const currentUser = await User.findOne({'name': req.body.login}).lean();
            if (currentUser) {
                // checking password
                bcrypt.compare(req.body.password, currentUser.password, (err, response) => {
                    if (response) {
                        // signing user using jwt
                        jwt.sign({_id: currentUser._id}, process.env.TOKEN_SECRET, (err, token) => {
                            // not using secure cookies if project is running in dev mode and vica versa
                            if(process.env.NODE_ENV === 'dev'){
                                res.cookie('auth-token', token, {
                                    httpOnly: true
                                })
                                .redirect('/');
                            }else if(process.env.NODE_ENV === 'prod'){
                                res.cookie('auth-token', token, {
                                    httpOnly: true,
                                    secure: true
                                });
                                res.redirect('/');
                            }
                        });
                    }
                });
            } else {
                res.redirect('login');
            }
        } catch (err) {
            
        }
    } else {
        res.render('error/500');
    }
});

// register page
// GET Request
router.get('/signup', async (req, res) => {
    res.render('signup', {
        layout: 'login'
    })
});

// register
// POST Request
router.post('/api/register', async (req, res) => {
    try {
        if (req.body) {
            // encrypting the password using bcrypt
            bcrypt.genSalt(10, async (err, salt) => {
                bcrypt.hash(req.body.password, salt, async (err, hash) => {
                    if (hash) {
                        await User.create({
                            name: req.body.name,
                            email: req.body.email,
                            password: hash,
                        });
                        res.redirect('/forum');
                    } else {
                        console.error(err);
                    }
                });
            });
        } else {
            
        }
    } catch (err) {
        res.render('error/500');
        console.error(err);
    }
});

module.exports = router;