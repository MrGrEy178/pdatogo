const router = require('express').Router();
const User = require('../schemas/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// test page
// GET request
router.get('/', async (req, res) => {
    res.render('test');
});

// login page 
// GET Request
router.get('/login', async (req, res) => {
    res.render('login', {
        layout: 'login'
    });
});

// login page 
// POST Request
router.post('/login', async (req, res) => {
    if (req.body) {
        try {
            const currentUser = await User.findOne({'name': req.body.login}).lean();
            if (currentUser) {
                bcrypt.compare(req.body.password, currentUser.password, (err, response) => {
                    if (response) {
                        jwt.sign({currentUser}, process.env.TOKEN_SECRET, (err, token) => {
                            res.header('auth-token', token);
                            res.redirect('/');
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

// register page
// POST Request
router.post('/verifyIdentity', async (req, res) => {
    try {
        if (req.body) {
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