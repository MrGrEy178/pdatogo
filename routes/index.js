const router = require('express').Router();
const User = require('../schemas/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {verifyAuth, verifyGuest} = require('../middleware/tokenVerify');

// main page
// GET request
router.get('/', verifyAuth, async (req, res) => {
    const currentUser = await User.findById(req.userId).lean();
    let content = "";
    /*let devices = Device.find();;
    if (devices) {
        // Adding to the main page three latest added devices
        for(let i = devices.length - 1; i > devices.length - 4; i--){
            if (devices.length > 2){
                content += "<div class=\"latest_devices\">\n<img src=\"" + devices[i].pictures[0] + "\">\n<a class=\"device_header>" + "</a>\n</div>\n";
            } else if(devices.length <= 2 && devices.length > 1){
                if (i < 0) {
                    break;
                }else{
                    content += "<div class=\"latest_devices\">\n<img src=\"" + devices[i].pictures[0] + "\">\n<a class=\"device_header>" + "</a>\n</div>\n";
                }
            }
        }
    } else {
        content = false;
    }*/
    let username = currentUser['name'];
    res.render('main', {
        content,
        //avatar,
        username
    });
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
router.post('/api/login', async (req, res) => {
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
                            switch (process.env.NODE_ENV){
                                case 'dev': 
                                    res.cookie('access_token', token, {
                                        httpOnly: true,
                                    })
                                    .redirect('/');
                                    break;
                                case 'prod':
                                    res.cookie('access_token', token, {
                                        httpOnly: true,
                                        secure: true,
                                    })
                                    .redirect('/');
                                    break;
                                default:
                                    res.redirect('../login');
                            }
                        });
                    } else{
                        res.redirect('../login');
                    }
                });
            } else {
                res.redirect('../login');
            }
        } catch (err) {
            
        }
    } else {
        res.render('error/500');
    }
});

// Logout
// GET Request
router.get('/logout', async (req, res) => {
    res.clearCookie('access_token');
    res.redirect('/login');
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
                            role: 'newbie',
                        });
                        res.redirect('/');
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