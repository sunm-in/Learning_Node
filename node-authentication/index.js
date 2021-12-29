require('dotenv').config();
const { PORT, DB_URL } = process.env;
const express = require('express');
const app = express();
const port = PORT || 4000;
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
        res.cookie('x_auth', user.token).status(200).json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

http.listen(port, () => {
  console.log(`listening on ${port}`);
});
