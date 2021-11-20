const router = require('express').Router();

function isLogin(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send('로그인이 필요한 요청입니다!');
  }
}

router.use(isLogin);
// router.use('/shirts', isLogin); 특정 URL에만 적용하는 미들웨어

router.get('/shirts', (req, res) => {
  res.send('셔츠 파는 페이지');
});

router.get('/pants', (req, res) => {
  res.send('바지 파는 페이지');
});

module.exports = router;
