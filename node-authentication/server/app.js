require('dotenv').config();
const { PORT, DB_URL } = process.env;
const express = require('express');
const app = express();
const port = PORT || 5000;
const http = require('http').createServer(app);
const cors = require('cors');
const { User } = require('./models/User');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose
  .connect(DB_URL)
  .then(() => console.log('MongoDB Connected...'))
  .catch((err) => console.error(err));

http.listen(port, () => {
  console.log(`listening on ${port}`);
});

app.get('/api/hello', (req, res) => {
  res.send('Hello World!!');
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/api/users/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '이메일을 다시 한 번 확인해 주세요.',
      });
    }

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: '비밀번호를 확인해 주세요.',
        });
      }

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

app.get('/api/users/auth', auth, (req, res) => {
  // authentication 이 true일 때 클라이언트에 보내줄 정보
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true, // 0이면 일반유저, 0이 아니면 관리자
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});
