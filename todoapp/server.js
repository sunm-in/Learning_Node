const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));
const MongoClient = require('mongodb').MongoClient;
const methodOverride = require('method-override');
const { ObjectId } = require('mongodb');
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use('/public', express.static('public'));
require('dotenv').config();

// app.listen(8080, () => {
//   console.log('listening on 8080');
// });

let db;
MongoClient.connect(
  process.env.DB_URL,
  { useUnifiedTopology: true },
  (error, client) => {
    // 연결되면 할일
    if (error) return console.log(error);
    db = client.db('todoapp');

    // db.collection('post').insertOne(
    //   { 이름: 'John', _id: 100 },
    //   (error, result) => {
    //     console.log('저장완료');
    //   }
    // );

    app.listen(process.env.PORT, function () {
      console.log('listening on server');
    });
  }
);

// app.get('/임시', function (req, res) {
//   res.sendFile(__dirname + '/')
// });

// 메인페이지
app.get('/', (req, res) => {
  // res.sendFile(__dirname + '/index.html');
  res.render('index.ejs');
});

// 작성페이지
app.get('/write', (req, res) => {
  // res.sendFile(__dirname + '/write.html');
  res.render('write.ejs');
});

// route 적용 예시
app.use('/shop', require('./routes/shop'));
app.use('/board/sub', require('./routes/board'));

// 게시물 목록 페이지
app.get('/list', (req, res) => {
  db.collection('post')
    .find()
    .toArray((err, result) => {
      // console.log(result);
      res.render('list.ejs', { posts: result });
    });
});

// 상세페이지
app.get('/detail/:id', (req, res) => {
  db.collection('post').findOne(
    { _id: parseInt(req.params.id) },
    (err, result) => {
      console.log(result);
      res.render('detail.ejs', { data: result });
    }
  );
});

// 게시물 수정
app.get('/edit/:id', (req, res) => {
  db.collection('post').findOne(
    { _id: parseInt(req.params.id) },
    (err, result) => {
      console.log(result);
      res.render('edit.ejs', { post: result });
    }
  );
});

// form에 담긴 제목, 날짜 데이터를 가지고 db.collection에 업데이트하기
app.put('/edit', (req, res) => {
  db.collection('post').updateOne(
    { _id: parseInt(req.body.id) },
    { $set: { title: req.body.title, date: req.body.date } },
    (err, result) => {
      console.log('수정완료');
      res.redirect('/list');
    }
  );
});

// 검색
app.get('/search', (req, res) => {
  let searchRequire = [
    {
      $search: {
        index: 'titleSearch',
        text: {
          query: req.query.value,
          path: 'title',
        },
      },
    },
    { $sort: { _id: 1 } },
  ];
  db.collection('post')
    .aggregate(searchRequire)
    .toArray((err, result) => {
      res.render('search.ejs', { posts: result });
      console.log(result);
    });
});

// 로그인
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

app.use(
  session({ secret: 'secretCode', resave: true, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/fail',
  }),
  (req, res) => {
    res.redirect('/');
  }
);

// 마이페이지
app.get('/mypage', isLogin, (req, res) => {
  console.log(req.user);
  res.render('mypage.ejs', { admin: req.user });
});

function isLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send('로그인이 필요한 요청입니다!');
  }
}

// 로그아웃
app.get('/logout', (req, res) => {
  req.logout();
  req.session.save(function (err) {
    if (err) throw err;
    res.redirect('/');
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'id',
      passwordField: 'pw',
      session: true,
      passReqToCallback: false,
    },
    (userId, userPw, done) => {
      // console.log(userId, userPw);
      db.collection('login').findOne({ id: userId }, (err, result) => {
        if (err) return done(err);

        if (!result)
          return done(null, false, { message: '존재하지 않는 아이디 입니다.' });

        if (userPw == result.pw) {
          return done(null, result);
        } else {
          return done(null, false, {
            message: '비밀번호가 일치하지 않습니다.',
          });
        }
      });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  db.collection('login').findOne({ id: id }, (err, result) => {
    done(null, result);
  });
});

// 회원기능이 필요하면 passport 세팅하는 부분이 위에 있어야함

// 저장 전에 id가 이미 있는지 체크하기, id에 알파벳 숫자만 잘 들어있나 체크, 비밀번호 저장 전에 암호화를 했는지 체크
app.post('/register', (req, res) => {
  db.collection('login').insertOne(
    { id: req.body.id, pw: req.body.pw },
    (err, result) => {
      res.redirect('/');
    }
  );
});

// post 작성
app.post('/add', (req, res) => {
  // res.send('전송완료');
  db.collection('counter').findOne({ name: 'postLength' }, (err, result) => {
    let postNumber = result.totalPost;
    let postInfo = {
      _id: postNumber + 1,
      writer: req.user._id,
      title: req.body.title,
      date: req.body.date,
    };

    db.collection('post').insertOne(postInfo, (err, result) => {
      if (err) console.log(err);
      console.log('todo 저장 완료');
      res.redirect('/list');
      db.collection('counter').updateOne(
        { name: 'postLength' },
        { $inc: { totalPost: 1 } },
        (err, result) => {
          if (err) {
            return console.log(err);
          }
        }
      );
    });
  });
});

// 게시물 삭제
app.delete('/delete', (req, res) => {
  console.log(req.body);
  req.body._id = parseInt(req.body._id);

  let deletePost = { _id: req.body._id, writer: req.user._id };

  db.collection('post').deleteOne(deletePost, (err, result) => {
    console.log('삭제완료');
    if (err) console.log(err);
    res.status(200).send({ message: '요청성공' });
    // res.status(400).send({ message: '요청실패' });
  });
});

// multer 라이브러리
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/image');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// 이미지 업로드
app.get('/upload', (req, res) => {
  res.render('upload.ejs');
});

// 이미지 여러개, 받을 최대 갯수 -> upload.array('profile', 5)
app.post('/upload', upload.single('profile'), (req, res) => {
  res.send('업로드 완료');
});

app.get('/image/:imageName', (req, res) => {
  res.sendFile(__dirname + '/public/image/' + req.params.imageName);
});

// 채팅
app.post('/chatroom', isLogin, (req, res) => {
  let chatInfo = {
    title: '채팅방이름',
    member: [ObjectId(req.body.recevingId), req.user._id],
    date: new Date(),
  };

  db.collection('chatroom')
    .insertOne(chatInfo)
    .then((result) => {
      res.send('채팅방 생성 완료');
    })
    .catch((err) => {
      console.error(err);
    });
});

app.get('/chat', isLogin, (req, res) => {
  db.collection('chatroom')
    .find({ member: req.user._id })
    .toArray()
    .then((result) => {
      res.render('chat.ejs', { data: result });
    })
    .catch((err) => {
      console.error(err);
    });
});

app.post('/message', isLogin, (req, res) => {
  const chatInfo = {
    parent: req.body.parent,
    content: req.body.content,
    userId: req.user._id,
    date: new Date(),
  };

  db.collection('message')
    .insertOne(chatInfo)
    .then((result) => {
      console.log('DB저장성공');
      res.send('DB저장성공2');
    })
    .catch((err) => {
      console.error(err);
    });
});
