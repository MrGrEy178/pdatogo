const router = require('express').Router();


// login/register page
router.get('/login', async (req, res) => {
    res.render('login');
})