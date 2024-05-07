const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const loginRouter = require('./routes/login');
const visitRouter = require('./routes/visit');
const uploadRouter = require('./routes/upload');

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('mySign'));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 600000,
        },
        name: 'my-session-cookie',
    })
);

try {
    fs.readdirSync('./uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

// 라우터 등록
app.use('/', loginRouter);
app.use('/visit', visitRouter);
app.use('/upload', uploadRouter);

//404 에러처리 미들웨어
app.use((req, res, next) => {
    res.status(404).send(`${req.method} ${req.path} is NOT FOUND`);
});

// 서버 에러처리 미들웨어
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send('Something broke!');
});

app.listen(app.get('port'), () => {
    console.log(`http://localhost:${app.get('port')}에서 대기중`);
});
