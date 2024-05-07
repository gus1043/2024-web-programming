// 수업참여0507-최지현(60211704)
const express = require('express');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
    console.log(req.session);
    console.log(req.sessionID);
    // 여기에서 res.session.views가 아니라 req.session.views를 사용해야 합니다.
    if (req.session.views) {
        res.send(`<h2>views: ${req.session.views}</h2><h2>expires in: ${req.session.cookie.maxAge / 1000}'s</h2>`);
    } else {
        res.redirect('/login');
    }
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/admit', (req, res) => {
    const { login, password } = req.body;
    if (login == 'guest' && password == '7777') {
        req.session.views = (req.session.views || 0) + 1;
        res.redirect('/');
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
